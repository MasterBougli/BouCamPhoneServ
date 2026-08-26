// Initialise la page de lecture utilisée par OBS et les autres viewers.
(() => {
  const remoteVideo = document.getElementById("remoteVideo");
  const remoteAudio = document.getElementById("remoteAudio");
  const sourceOverlay = document.getElementById("sourceOverlay");
  const sourceLabel = document.getElementById("sourceLabel");
  const placeholder = document.getElementById("placeholder");

  const state = {
    bootstrap: null,
    sessionId: null,
    session: null,
    pc: null,
    lastSeq: 0,
    active: false,
  };
  let cleanMode = new URLSearchParams(window.location.search).get("clean") === "1";

  // Déduit l'identifiant de session depuis l'URL courante.
  function sessionIdFromPath() {
    const segments = window.location.pathname.split("/").filter(Boolean);
    if (segments[0] === "view" && segments[1]) {
      return segments[1];
    }
    const fromQuery = new URLSearchParams(window.location.search).get("session");
    return fromQuery || null;
  }

  // Met à jour le bandeau d'information affiché sur la source.
  function setOverlay(text, tone = "good") {
    sourceLabel.textContent = text;
    sourceOverlay.querySelector(".chip").className = `chip ${tone}`.trim();
    sourceOverlay.classList.toggle("hidden", cleanMode);
  }

  // Affiche ou masque l'espace réservé quand le flux n'est pas prêt.
  function showPlaceholder(show) {
    placeholder.style.display = cleanMode ? "none" : show ? "grid" : "none";
    sourceOverlay.classList.toggle("hidden", cleanMode || !show);
  }

  // Ferme proprement la connexion WebRTC active.
  function closePeerConnection() {
    if (state.pc) {
      state.pc.onicecandidate = null;
      state.pc.ontrack = null;
      state.pc.onconnectionstatechange = null;
      state.pc.close();
      state.pc = null;
    }
  }

  // Envoie un message de signalisation vers le téléphone.
  async function sendMessage(kind, payload) {
    if (!state.sessionId) {
      return;
    }
    await BouCamPhoneServ.fetchJson(`/api/sessions/${state.sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        from: "viewer",
        messages: [
          {
            kind,
            payload,
          },
        ],
      }),
    });
  }

  // Notifie le serveur de l'état courant du viewer.
  async function sendState(status) {
    if (!state.sessionId) {
      return;
    }
    await BouCamPhoneServ.fetchJson(`/api/sessions/${state.sessionId}/state`, {
      method: "POST",
      body: JSON.stringify({
        role: "viewer",
        status,
      }),
    });
  }

  // Crée la connexion WebRTC côté viewer.
  async function createPeerConnection() {
    closePeerConnection();
    const pc = new RTCPeerConnection({ iceServers: [] });
    state.pc = pc;

    // Reçoit le flux distant et l'attache aux éléments média.
    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        remoteVideo.srcObject = stream;
        remoteAudio.srcObject = stream;
        remoteVideo.muted = true;
        remoteVideo.playsInline = true;
        remoteAudio.autoplay = true;
        remoteAudio.play().catch(() => {});
        remoteVideo.play().catch(() => {});
        state.active = true;
        setOverlay(state.session?.label || `Session ${state.sessionId}`, "good");
        showPlaceholder(false);
      }
    };

    // Relaye chaque candidat ICE au téléphone.
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage("ice", event.candidate.toJSON ? event.candidate.toJSON() : event.candidate).catch(console.error);
      }
    };

    // Réagit aux changements d'état de la connexion WebRTC.
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        state.active = true;
        setOverlay(state.session?.label || `Session ${state.sessionId}`, "good");
        showPlaceholder(false);
      } else if (pc.connectionState === "connecting") {
        setOverlay("Connexion vidéo", "warn");
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        state.active = false;
        setOverlay("Déconnecté", "danger");
        showPlaceholder(true);
      }
    };

    return pc;
  }

  // Répond à une offre WebRTC reçue du téléphone.
  async function handleOffer(offer) {
    if (!state.pc) {
      await createPeerConnection();
    }
    await state.pc.setRemoteDescription(offer);
    const answer = await state.pc.createAnswer();
    await state.pc.setLocalDescription(answer);
    await sendMessage("answer", state.pc.localDescription);
    setOverlay(state.session?.label || `Session ${state.sessionId}`, "good");
    showPlaceholder(false);
    await sendState("live");
  }

  // Récupère les messages de signalisation en attente.
  async function pollLoop() {
    if (!state.sessionId) {
      return;
    }

    try {
      const response = await BouCamPhoneServ.fetchJson(
        `/api/sessions/${state.sessionId}/messages?role=viewer&after=${state.lastSeq}`
      );
      for (const message of response.items || []) {
        state.lastSeq = Math.max(state.lastSeq, message.seq);
        if (message.kind === "offer") {
          await handleOffer(message.payload);
        }
        if (message.kind === "ice" && state.pc) {
          try {
            await state.pc.addIceCandidate(message.payload);
          } catch (error) {
            console.warn("ICE candidate rejected", error);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setOverlay("Connexion en attente", "warn");
      showPlaceholder(true);
    }
  }

  // Envoie régulièrement un battement de présence.
  async function heartbeatLoop() {
    if (!state.sessionId) {
      return;
    }
    try {
      await sendState(state.active ? "live" : "waiting");
    } catch (error) {
      console.error(error);
    }
  }

  // Initialise la vue et lance la réception du flux.
  async function boot() {
    state.sessionId = sessionIdFromPath();
    if (!state.sessionId) {
      setOverlay("Aucune session", "danger");
      return;
    }

    try {
      state.bootstrap = await BouCamPhoneServ.fetchJson("/api/bootstrap");
      const response = await BouCamPhoneServ.fetchJson(`/api/sessions/${state.sessionId}`);
      state.session = response.session;
      sourceLabel.textContent = state.session.label;
      document.title = `BouCamPhoneServ - ${state.session.label}`;
      if (!cleanMode && state.bootstrap?.settings?.cleanViewer) {
        cleanMode = true;
      }
      showPlaceholder(true);
      setOverlay(state.session.label || `Session ${state.sessionId}`, "warn");
      await sendState("waiting");
    } catch (error) {
      console.error(error);
      setOverlay("Session introuvable", "danger");
      showPlaceholder(true);
      return;
    }

    // Vérifie fréquemment les messages entrants.
    setInterval(() => {
      pollLoop().catch(console.error);
    }, 200);
    // Maintient la présence du viewer côté serveur.
    setInterval(() => {
      heartbeatLoop().catch(console.error);
    }, 5000);

    await createPeerConnection();
    await pollLoop();
    await heartbeatLoop();
  }

  boot().catch((error) => {
    console.error(error);
    setOverlay("Erreur de source", "danger");
    showPlaceholder(true);
  });
})();
