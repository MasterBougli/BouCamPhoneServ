(() => {
  const storageKey = "camfromphone.sessionId";
  const labelKey = "camfromphone.label";

  const startButton = document.getElementById("startButton");
  const switchButton = document.getElementById("switchButton");
  const muteButton = document.getElementById("muteButton");
  const stopButton = document.getElementById("stopButton");
  const copyLinkButton = document.getElementById("copyLinkButton");
  const saveLabelButton = document.getElementById("saveLabelButton");
  const labelInput = document.getElementById("labelInput");
  const localVideo = document.getElementById("localVideo");
  const statusChip = document.getElementById("statusChip");
  const sessionIdValue = document.getElementById("sessionIdValue");
  const sessionStateValue = document.getElementById("sessionStateValue");
  const cameraValue = document.getElementById("cameraValue");
  const audioValue = document.getElementById("audioValue");
  const hintText = document.getElementById("hintText");
  const previewTitle = document.getElementById("previewTitle");
  const previewSubtitle = document.getElementById("previewSubtitle");
  const networkChip = document.getElementById("networkChip");
  const permissionChip = document.getElementById("permissionChip");

  const state = {
    session: null,
    pc: null,
    stream: null,
    pollTimer: null,
    heartbeatTimer: null,
    lastSeq: 0,
    facingMode: "environment",
    audioEnabled: true,
    active: false,
    connecting: false,
    deviceType: BouCamPhoneServ.deviceName(),
  };

  function setStatus(text, tone = "warn") {
    statusChip.className = `chip ${tone}`.trim();
    statusChip.textContent = text;
  }

  function setPermission(text, tone = "warn") {
    permissionChip.className = `chip ${tone}`.trim();
    permissionChip.textContent = text;
  }

  function setNetwork(text, tone = "warn") {
    networkChip.className = `chip ${tone}`.trim();
    networkChip.textContent = text;
  }

  function setHint(text) {
    hintText.textContent = text;
  }

  function updateStaticFields() {
    sessionIdValue.textContent = state.session?.id || "—";
    sessionStateValue.textContent = state.session?.state || "En attente";
    cameraValue.textContent = state.facingMode;
    audioValue.textContent = state.audioEnabled ? "Activé" : "Coupé";
    previewTitle.textContent = state.session?.label || "Aperçu local";
    previewSubtitle.textContent = state.active
      ? "Le téléphone envoie la vidéo vers le PC en direct."
      : "La vidéo s’affiche ici avant d’être diffusée au PC.";
    muteButton.textContent = state.audioEnabled ? "Couper le micro" : "Réactiver le micro";
    labelInput.value = state.session?.label || labelInput.value || "Phone";
  }

  async function ensureSession() {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        const response = await BouCamPhoneServ.fetchJson(`/api/sessions/${cached}`);
        state.session = response.session;
        labelInput.value = localStorage.getItem(labelKey) || response.session.label || BouCamPhoneServ.deviceName();
        updateStaticFields();
        return;
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    const label = localStorage.getItem(labelKey) || BouCamPhoneServ.deviceName();
    const created = await BouCamPhoneServ.fetchJson("/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        label,
        deviceType: state.deviceType,
      }),
    });
    state.session = created.session;
    localStorage.setItem(storageKey, state.session.id);
    localStorage.setItem(labelKey, state.session.label);
    labelInput.value = state.session.label;
    updateStaticFields();
  }

  async function sendState(extra = {}) {
    if (!state.session) {
      return;
    }
    await BouCamPhoneServ.fetchJson(`/api/sessions/${state.session.id}/state`, {
      method: "POST",
      body: JSON.stringify({
        role: "publisher",
        status: state.active ? "streaming" : state.connecting ? "connecting" : "waiting",
        label: labelInput.value.trim() || state.session.label,
        facingMode: state.facingMode,
        deviceType: state.deviceType,
        hasAudio: state.audioEnabled,
        hasVideo: Boolean(state.stream),
        ...extra,
      }),
    });
  }

  async function sendSignal(kind, payload) {
    if (!state.session) {
      return;
    }
    await BouCamPhoneServ.fetchJson(`/api/sessions/${state.session.id}/messages`, {
      method: "POST",
      body: JSON.stringify({
        from: "publisher",
        messages: [
          {
            kind,
            payload,
          },
        ],
      }),
    });
  }

  function closePeerConnection() {
    if (state.pc) {
      state.pc.onicecandidate = null;
      state.pc.onconnectionstatechange = null;
      state.pc.oniceconnectionstatechange = null;
      state.pc.ontrack = null;
      state.pc.close();
      state.pc = null;
    }
  }

  function stopStreamTracks() {
    if (state.stream) {
      for (const track of state.stream.getTracks()) {
        track.stop();
      }
      state.stream = null;
    }
    localVideo.srcObject = null;
  }

  async function acquireMedia() {
    const constraints = {
      audio: true,
      video: {
        facingMode: { ideal: state.facingMode },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    state.stream = stream;
    state.audioEnabled = true;
    localVideo.srcObject = stream;
    localVideo.muted = true;
    localVideo.playsInline = true;
    updateStaticFields();
    await sendState();
    return stream;
  }

  async function createPeerConnection() {
    closePeerConnection();
    const pc = new RTCPeerConnection({
      iceServers: [],
    });
    state.pc = pc;

    for (const track of state.stream.getTracks()) {
      pc.addTrack(track, state.stream);
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal("ice", event.candidate.toJSON ? event.candidate.toJSON() : event.candidate).catch(console.error);
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setStatus("En direct", "good");
        setNetwork("Connecté", "good");
      } else if (pc.connectionState === "connecting") {
        setStatus("Connexion", "warn");
        setNetwork("Connexion", "warn");
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        setStatus("Déconnecté", "danger");
        setNetwork("Déconnecté", "danger");
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setNetwork("Connecté", "good");
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await sendSignal("offer", pc.localDescription);
  }

  async function pollLoop() {
    if (!state.session) {
      return;
    }

    try {
      const response = await BouCamPhoneServ.fetchJson(
        `/api/sessions/${state.session.id}/messages?role=publisher&after=${state.lastSeq}`
      );
      for (const message of response.items || []) {
        state.lastSeq = Math.max(state.lastSeq, message.seq);
        if (message.kind === "answer" && state.pc) {
          await state.pc.setRemoteDescription(message.payload);
        }
        if (message.kind === "ice" && state.pc) {
          try {
            await state.pc.addIceCandidate(message.payload);
          } catch (error) {
            console.warn("ICE candidate rejected", error);
          }
        }
        if (message.kind === "command") {
          await handleCommand(message.payload || {});
        }
      }
      setNetwork(state.active ? "Connecté" : "En attente", state.active ? "good" : "warn");
    } catch (error) {
      console.error(error);
      setNetwork("Erreur de signalement", "danger");
    }
  }

  async function heartbeatLoop() {
    if (!state.session) {
      return;
    }
    try {
      await sendState();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCommand(command) {
    if (command.action === "switchCamera") {
      await switchCamera();
    } else if (command.action === "toggleMicrophone") {
      await toggleMicrophone();
    } else if (command.action === "stop") {
      await stopSession();
    } else if (command.action === "rename" && typeof command.label === "string") {
      labelInput.value = command.label;
      await saveLabel();
    }
  }

  async function startSession() {
    if (state.connecting || state.active) {
      return;
    }
    state.connecting = true;
    setStatus("Connexion", "warn");
    setPermission("Demande d’accès", "warn");
    setHint("Une permission caméra et micro va s’ouvrir. Accepte-la pour lancer la diffusion.");

    try {
      if (!state.session) {
        await ensureSession();
      }
      if (!state.session) {
        throw new Error("Session introuvable");
      }
      if (!state.stream) {
        await acquireMedia();
      }
      await createPeerConnection();
      state.active = true;
      setStatus("En direct", "good");
      setPermission("Autorisé", "good");
      setNetwork("Connecté", "good");
      setHint("La source est maintenant prête pour OBS.");
      await sendState({ status: "streaming" });
    } catch (error) {
      console.error(error);
      state.active = false;
      setStatus("Erreur", "danger");
      setPermission("Bloqué", "danger");
      setHint(error.message || "Impossible de lancer la caméra.");
      await sendState({ status: "error" }).catch(() => {});
    } finally {
      state.connecting = false;
      updateStaticFields();
    }
  }

  async function switchCamera() {
    if (!state.stream) {
      state.facingMode = state.facingMode === "environment" ? "user" : "environment";
      cameraValue.textContent = state.facingMode;
      return;
    }

    const nextFacing = state.facingMode === "environment" ? "user" : "environment";
    state.facingMode = nextFacing;

    const nextStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: { ideal: nextFacing },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    });

    const oldVideoTrack = state.stream.getVideoTracks()[0];
    const newVideoTrack = nextStream.getVideoTracks()[0];
    const oldAudioTrack = state.stream.getAudioTracks()[0];
    const newAudioTrack = nextStream.getAudioTracks()[0];

    const videoSender = state.pc?.getSenders().find((sender) => sender.track && sender.track.kind === "video");
    const audioSender = state.pc?.getSenders().find((sender) => sender.track && sender.track.kind === "audio");

    if (videoSender && newVideoTrack) {
      await videoSender.replaceTrack(newVideoTrack);
    }
    if (audioSender && newAudioTrack) {
      await audioSender.replaceTrack(newAudioTrack);
    }

    if (oldVideoTrack) {
      oldVideoTrack.stop();
    }
    if (oldAudioTrack) {
      oldAudioTrack.stop();
    }

    state.stream = nextStream;
    localVideo.srcObject = nextStream;
    updateStaticFields();
    await sendState({ facingMode: state.facingMode });
  }

  async function toggleMicrophone() {
    if (!state.stream) {
      return;
    }

    const audioTrack = state.stream.getAudioTracks()[0];
    if (!audioTrack) {
      return;
    }

    state.audioEnabled = !state.audioEnabled;
    audioTrack.enabled = state.audioEnabled;
    updateStaticFields();
    await sendState({ hasAudio: state.audioEnabled });
  }

  async function stopSession() {
    state.active = false;
    state.connecting = false;
    closePeerConnection();
    stopStreamTracks();
    setStatus("Arrêté", "warn");
    setPermission("Permis", "warn");
    setNetwork("Déconnecté", "warn");
    setHint("Le flux a été arrêté. Tu peux redémarrer à tout moment.");
    await sendState({ status: "waiting", hasVideo: false }).catch(() => {});
    updateStaticFields();
  }

  async function saveLabel() {
    const label = labelInput.value.trim() || BouCamPhoneServ.deviceName();
    labelInput.value = label;
    localStorage.setItem(labelKey, label);
    if (state.session) {
      state.session.label = label;
      await sendState({ label });
    }
    updateStaticFields();
  }

  async function boot() {
    if (!("mediaDevices" in navigator) || !navigator.mediaDevices.getUserMedia) {
      setStatus("Incompatible", "danger");
      setPermission("Non supporté", "danger");
      setHint("Ce navigateur ne peut pas accéder à la caméra et au micro.");
      return;
    }

    setNetwork("En attente", "warn");
    setPermission("Permissions en attente", "warn");
    setStatus("Prêt", "warn");
    labelInput.value = localStorage.getItem(labelKey) || BouCamPhoneServ.deviceName();

    try {
      await ensureSession();
      await sendState({ status: "waiting" });
      setNetwork("Prêt", "good");
      updateStaticFields();
    } catch (error) {
      console.error(error);
      setStatus("Erreur", "danger");
      setHint(error.message || "Impossible de préparer la session.");
    }

    startButton.addEventListener("click", () => startSession().catch((error) => {
      console.error(error);
      setStatus("Erreur", "danger");
      setHint(error.message || "Impossible de lancer la caméra.");
    }));

    switchButton.addEventListener("click", () => switchCamera().catch(console.error));
    muteButton.addEventListener("click", () => toggleMicrophone().catch(console.error));
    stopButton.addEventListener("click", () => stopSession().catch(console.error));
    copyLinkButton.addEventListener("click", async () => {
      await BouCamPhoneServ.copyText(window.location.href);
      copyLinkButton.textContent = "Lien copié";
      setTimeout(() => {
        copyLinkButton.textContent = "Copier le lien";
      }, 1200);
    });
    saveLabelButton.addEventListener("click", () => saveLabel().catch(console.error));
    labelInput.addEventListener("change", () => saveLabel().catch(console.error));

    state.pollTimer = setInterval(() => {
      pollLoop().catch(console.error);
    }, 350);
    state.heartbeatTimer = setInterval(() => {
      heartbeatLoop().catch(console.error);
    }, 5000);

    await pollLoop();
    await heartbeatLoop();
  }

  boot().catch((error) => {
    console.error(error);
    setStatus("Erreur", "danger");
    setHint(error.message || "Le démarrage a échoué.");
  });
})();
