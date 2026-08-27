// Initialise la mosaïque de supervision multi-caméras.
(() => {
  const grid = document.getElementById("mosaicGrid");
  const empty = document.getElementById("mosaicEmpty");
  const count = document.getElementById("mosaicCount");
  const hint = document.getElementById("mosaicHint");
  const serverState = document.getElementById("mosaicServerState");
  const refreshButton = document.getElementById("refreshMosaicButton");
  const densitySelect = document.getElementById("densitySelect");
  const viewers = new Map();
  let refreshing = false;

  // Construit un identifiant de viewer unique pour une caméra de la mosaïque.
  function createViewerId(sessionId) {
    return `mosaic-${sessionId}-${crypto.randomUUID()}`;
  }

  // Envoie un message de signalisation ciblé vers un téléphone.
  async function sendMessage(viewer, kind, payload) {
    await BouCamPhoneServ.fetchJson(`/api/sessions/${viewer.session.id}/messages`, {
      method: "POST",
      body: JSON.stringify({
        from: "viewer",
        viewerId: viewer.id,
        messages: [{ kind, payload, viewerId: viewer.id }],
      }),
    });
  }

  // Met à jour la présence d'une tuile auprès du serveur.
  async function sendViewerState(viewer, status) {
    await BouCamPhoneServ.fetchJson(`/api/sessions/${viewer.session.id}/state`, {
      method: "POST",
      body: JSON.stringify({ role: "viewer", viewerId: viewer.id, status }),
    });
  }

  // Met à jour l'état visuel affiché sur une tuile.
  function setTileState(viewer, label, tone = "warn") {
    viewer.status.textContent = label;
    viewer.status.className = `chip ${tone}`.trim();
  }

  // Ferme uniquement la connexion WebRTC de la tuile ciblée.
  function closePeer(viewer) {
    if (!viewer.pc) {
      return;
    }
    viewer.pc.ontrack = null;
    viewer.pc.onicecandidate = null;
    viewer.pc.onconnectionstatechange = null;
    viewer.pc.close();
    viewer.pc = null;
    viewer.video.srcObject = null;
  }

  // Crée la connexion WebRTC utilisée par une tuile vidéo.
  function createPeer(viewer) {
    closePeer(viewer);
    const pc = new RTCPeerConnection({ iceServers: [] });
    viewer.pc = pc;

    // Attache le flux reçu à la vidéo de la tuile.
    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (!stream) {
        return;
      }
      viewer.video.srcObject = stream;
      viewer.video.muted = viewer.muted;
      viewer.video.playsInline = true;
      viewer.video.play().catch(() => {});
      setTileState(viewer, "En direct", "good");
      viewer.card.classList.add("is-live");
    };

    // Transmet les candidats réseau générés par cette tuile.
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage(viewer, "ice", event.candidate.toJSON ? event.candidate.toJSON() : event.candidate).catch(console.error);
      }
    };

    // Réagit aux changements de connexion sans masquer les autres caméras.
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setTileState(viewer, "En direct", "good");
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        setTileState(viewer, "Signal perdu", "danger");
        viewer.card.classList.remove("is-live");
      } else if (pc.connectionState === "connecting") {
        setTileState(viewer, "Connexion", "warn");
      }
    };
    return pc;
  }

  // Répond à une offre reçue du téléphone pour cette tuile.
  async function handleOffer(viewer, offer) {
    const pc = createPeer(viewer);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await sendMessage(viewer, "answer", pc.localDescription);
    await sendViewerState(viewer, "live");
  }

  // Récupère les messages destinés à une tuile précise.
  async function pollViewer(viewer) {
    const response = await BouCamPhoneServ.fetchJson(
      `/api/sessions/${viewer.session.id}/messages?role=viewer&viewerId=${encodeURIComponent(viewer.id)}&after=${viewer.lastSeq}`
    );
    for (const message of response.items || []) {
      viewer.lastSeq = Math.max(viewer.lastSeq, message.seq);
      if (message.kind === "offer") {
        await handleOffer(viewer, message.payload);
      } else if (message.kind === "ice" && viewer.pc) {
        await viewer.pc.addIceCandidate(message.payload).catch((error) => console.warn("ICE candidate rejected", error));
      }
    }
  }

  // Active ou coupe le son d'une seule caméra.
  function toggleAudio(viewer) {
    viewer.muted = !viewer.muted;
    viewer.video.muted = viewer.muted;
    viewer.audioButton.textContent = viewer.muted ? "Activer le son" : "Couper le son";
    if (!viewer.muted) {
      viewer.video.play().catch(() => {});
    }
  }

  // Construit et connecte une nouvelle tuile caméra.
  async function addViewer(session) {
    const card = document.createElement("article");
    card.className = "mosaic-tile";
    card.innerHTML = `
      <div class="mosaic-video-wrap">
        <video autoplay playsinline muted aria-label="Flux vidéo de ${session.label}"></video>
        <div class="mosaic-scanline" aria-hidden="true"></div>
        <span class="chip warn mosaic-live-chip">Connexion</span>
      </div>
      <div class="mosaic-tile-footer">
        <div class="mosaic-tile-copy">
          <strong>${session.label}</strong>
          <span>ID ${session.id} · ${session.deviceType || "Téléphone"}</span>
        </div>
        <div class="card-actions mosaic-tile-actions">
          <button class="button-ghost" data-audio type="button">Activer le son</button>
          <a class="button-ghost" href="/view/${session.id}?clean=1" target="_blank" rel="noreferrer">Vue OBS</a>
        </div>
      </div>`;
    grid.appendChild(card);

    const viewer = {
      id: createViewerId(session.id),
      session,
      card,
      video: card.querySelector("video"),
      status: card.querySelector(".mosaic-live-chip"),
      audioButton: card.querySelector("[data-audio]"),
      muted: true,
      pc: null,
      lastSeq: 0,
      pollTimer: null,
    };
    viewers.set(session.id, viewer);
    viewer.audioButton.addEventListener("click", () => toggleAudio(viewer));
    await sendViewerState(viewer, "waiting");
    await sendMessage(viewer, "viewer-ready", { mode: "mosaic" });
    viewer.pollTimer = setInterval(() => pollViewer(viewer).catch(() => setTileState(viewer, "En attente", "warn")), 250);
    await pollViewer(viewer);
  }

  // Retire une tuile et informe le téléphone que son viewer est parti.
  function removeViewer(sessionId) {
    const viewer = viewers.get(sessionId);
    if (!viewer) {
      return;
    }
    clearInterval(viewer.pollTimer);
    sendMessage(viewer, "viewer-left", {}).catch(() => {});
    sendViewerState(viewer, "left").catch(() => {});
    closePeer(viewer);
    viewer.card.remove();
    viewers.delete(sessionId);
  }

  // Synchronise les tuiles avec les téléphones connus du serveur.
  async function refreshSessions() {
    if (refreshing) {
      return;
    }
    refreshing = true;
    try {
      const response = await BouCamPhoneServ.fetchJson("/api/sessions");
      const sessions = (response.items || []).filter((session) => session.publisherOnline);
      const activeIds = new Set(sessions.map((session) => session.id));
      for (const session of sessions) {
        if (!viewers.has(session.id)) {
          await addViewer(session);
        }
      }
      for (const sessionId of [...viewers.keys()]) {
        if (!activeIds.has(sessionId)) {
          removeViewer(sessionId);
        }
      }
      count.textContent = `${sessions.length} caméra${sessions.length > 1 ? "s" : ""}`;
      hint.textContent = sessions.length ? "Tous les signaux sont surveillés" : "En attente d’un téléphone";
      empty.hidden = sessions.length > 0;
      grid.hidden = sessions.length === 0;
      serverState.textContent = "Serveur en ligne";
      serverState.className = "chip good";
    } catch (error) {
      console.error(error);
      serverState.textContent = "Serveur hors ligne";
      serverState.className = "chip danger";
    } finally {
      refreshing = false;
    }
  }

  // Met à jour la densité visuelle choisie par l'utilisateur.
  function applyDensity() {
    grid.dataset.columns = densitySelect.value;
    localStorage.setItem("boucam.mosaicDensity", densitySelect.value);
  }

  // Maintient la présence de toutes les tuiles actives.
  function heartbeatViewers() {
    for (const viewer of viewers.values()) {
      sendViewerState(viewer, viewer.pc?.connectionState === "connected" ? "live" : "waiting").catch(() => {});
    }
  }

  // Libère les viewers lorsque la page mosaïque est fermée.
  function closeMosaic() {
    for (const sessionId of [...viewers.keys()]) {
      removeViewer(sessionId);
    }
  }

  // Démarre la supervision et branche ses commandes.
  async function boot() {
    densitySelect.value = localStorage.getItem("boucam.mosaicDensity") || "auto";
    applyDensity();
    densitySelect.addEventListener("change", applyDensity);
    refreshButton.addEventListener("click", () => refreshSessions());
    window.addEventListener("pagehide", closeMosaic);
    await refreshSessions();
    setInterval(() => refreshSessions(), 3000);
    setInterval(heartbeatViewers, 5000);
  }

  boot().catch(console.error);
})();
