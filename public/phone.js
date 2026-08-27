// Initialise l'interface téléphone et sa logique de diffusion.
(() => {
  const storageKey = "camfromphone.sessionId";
  const labelKey = "camfromphone.label";
  const mediaOverridesKey = "camfromphone.mediaOverrides";

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
  const qualityValue = document.getElementById("qualityValue");
  const hintText = document.getElementById("hintText");
  const previewTitle = document.getElementById("previewTitle");
  const previewSubtitle = document.getElementById("previewSubtitle");
  const networkChip = document.getElementById("networkChip");
  const permissionChip = document.getElementById("permissionChip");
  const phoneVideoPresetInput = document.getElementById("phoneVideoPresetInput");
  const phoneFrameRateInput = document.getElementById("phoneFrameRateInput");
  const phoneAudioBitrateInput = document.getElementById("phoneAudioBitrateInput");
  const applyPhoneQualityButton = document.getElementById("applyPhoneQualityButton");
  const phoneQualitySummary = document.getElementById("phoneQualitySummary");
  const phoneQualityHint = document.getElementById("phoneQualityHint");

  const state = {
    bootstrap: null,
    session: null,
    peers: new Map(),
    waitingViewers: new Set(),
    stream: null,
    pollTimer: null,
    heartbeatTimer: null,
    lastSeq: 0,
    facingMode: "environment",
    audioEnabled: true,
    active: false,
    connecting: false,
    mediaOverrides: loadStoredMediaOverrides(),
    deviceType: BouCamPhoneServ.deviceName(),
  };

  // Charge les préférences média locales mémorisées sur ce téléphone.
  function loadStoredMediaOverrides() {
    try {
      const value = JSON.parse(localStorage.getItem(mediaOverridesKey) || "{}");
      if (!value || typeof value !== "object") {
        return {};
      }
      const safe = {};
      if (["720p-low", "720p-balanced", "720p-high", "1080p-low", "1080p-balanced", "1080p-high", "1440p-high"].includes(value.videoPreset)) {
        safe.videoPreset = value.videoPreset;
      }
      if ([15, 24, 30, 60].includes(Number(value.videoFrameRate))) {
        safe.videoFrameRate = Number(value.videoFrameRate);
      }
      if ([32, 48, 64].includes(Number(value.audioBitrateKbps))) {
        safe.audioBitrateKbps = Number(value.audioBitrateKbps);
      }
      return safe;
    } catch {
      return {};
    }
  }

  // Fusionne les valeurs globales du serveur avec les choix propres au téléphone.
  function getEffectiveMediaSettings() {
    return {
      ...(state.bootstrap?.settings || {}),
      ...state.mediaOverrides,
    };
  }

  // Synchronise les sélecteurs locaux et leur résumé avec les valeurs effectives.
  function syncPhoneQualityControls() {
    const serverSettings = state.bootstrap?.settings || {};
    const effective = getEffectiveMediaSettings();
    phoneVideoPresetInput.value = state.mediaOverrides.videoPreset || "";
    phoneFrameRateInput.value = state.mediaOverrides.videoFrameRate ? String(state.mediaOverrides.videoFrameRate) : "";
    phoneAudioBitrateInput.value = state.mediaOverrides.audioBitrateKbps ? String(state.mediaOverrides.audioBitrateKbps) : "";
    phoneVideoPresetInput.options[0].textContent = `Serveur · ${BouCamPhoneServ.describeVideoPreset(serverSettings.videoPreset)}`;
    phoneFrameRateInput.options[0].textContent = `Serveur · ${serverSettings.videoFrameRate || 30} FPS`;
    phoneAudioBitrateInput.options[0].textContent = `Serveur · ${serverSettings.audioBitrateKbps || 48} kbps`;
    const localCount = Object.keys(state.mediaOverrides).length;
    phoneQualitySummary.textContent = localCount
      ? `${BouCamPhoneServ.describeVideoPreset(effective.videoPreset)} · ${effective.videoFrameRate || 30} FPS · ${effective.audioBitrateKbps || 48} kbps`
      : "Réglages du serveur";
  }

  // Met à jour le badge d'état principal.
  function setStatus(text, tone = "warn") {
    statusChip.className = `chip ${tone}`.trim();
    statusChip.textContent = text;
  }

  // Met à jour le badge lié aux permissions.
  function setPermission(text, tone = "warn") {
    permissionChip.className = `chip ${tone}`.trim();
    permissionChip.textContent = text;
  }

  // Met à jour le badge réseau.
  function setNetwork(text, tone = "warn") {
    networkChip.className = `chip ${tone}`.trim();
    networkChip.textContent = text;
  }

  // Affiche un message d'aide contextuel.
  function setHint(text) {
    hintText.textContent = text;
  }

  // Synchronise les champs statiques avec l'état courant.
  function updateStaticFields() {
    sessionIdValue.textContent = state.session?.id || "—";
    sessionStateValue.textContent = state.session?.state || "En attente";
    cameraValue.textContent = BouCamPhoneServ.describeFacingMode(state.facingMode);
    const mediaSettings = getEffectiveMediaSettings();
    const audioBitrate = mediaSettings.audioBitrateKbps || 48;
    audioValue.textContent = `${state.audioEnabled ? "Activé" : "Coupé"} · ${audioBitrate} kbps`;
    qualityValue.textContent = `${BouCamPhoneServ.describeVideoPreset(mediaSettings.videoPreset)} · ${mediaSettings.videoFrameRate || 30} FPS`;
    previewTitle.textContent = state.session?.label || "Aperçu local";
    previewSubtitle.textContent = state.active
      ? "Le téléphone envoie la vidéo vers le PC en direct."
      : "La vidéo s’affiche ici avant d’être diffusée au PC.";
    muteButton.textContent = state.audioEnabled ? "Couper le micro" : "Réactiver le micro";
    labelInput.value = state.session?.label || labelInput.value || "Phone";
  }

  // Charge la session persistée ou en crée une nouvelle si besoin.
  async function ensureSession() {
    const cached = localStorage.getItem(storageKey);
    const defaultLabel = state.bootstrap?.settings?.defaultLabel || BouCamPhoneServ.deviceName();

    if (cached) {
      try {
        const response = await BouCamPhoneServ.fetchJson(`/api/sessions/${cached}`);
        state.session = response.session;
        labelInput.value = localStorage.getItem(labelKey) || response.session.label || defaultLabel;
        updateStaticFields();
        return;
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    const label = localStorage.getItem(labelKey) || defaultLabel;
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

  // Envoie l'état courant du téléphone au serveur.
  async function sendState(extra = {}) {
    if (!state.session) {
      return;
    }
    const mediaSettings = getEffectiveMediaSettings();
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
        videoPreset: mediaSettings.videoPreset,
        videoFrameRate: mediaSettings.videoFrameRate || 30,
        audioBitrateKbps: mediaSettings.audioBitrateKbps || 48,
        ...extra,
      }),
    });
  }

  // Envoie un signal WebRTC au service de signalisation.
  async function sendSignal(kind, payload, viewerId = null) {
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
            viewerId,
          },
        ],
      }),
    });
  }

  // Ferme proprement la connexion WebRTC en cours.
  function closePeerConnection(viewerId) {
    const pc = state.peers.get(viewerId);
    if (!pc) {
      return;
    }
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.oniceconnectionstatechange = null;
    pc.close();
    state.peers.delete(viewerId);
  }

  // Ferme toutes les connexions WebRTC ouvertes vers les viewers.
  function closeAllPeerConnections() {
    for (const viewerId of [...state.peers.keys()]) {
      closePeerConnection(viewerId);
    }
    state.waitingViewers.clear();
  }

  // Arrête les pistes média et libère l'aperçu local.
  function stopStreamTracks() {
    if (state.stream) {
      for (const track of state.stream.getTracks()) {
        track.stop();
      }
      state.stream = null;
    }
    localVideo.srcObject = null;
  }

  // Demande l'accès à la caméra et au micro avec les bons réglages.
  async function acquireMedia() {
    const settings = getEffectiveMediaSettings();
    const constraints = BouCamPhoneServ.buildCaptureConstraints(settings);
    constraints.video.facingMode = { ideal: state.facingMode };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    state.stream = stream;
    state.audioEnabled = !settings.startMuted;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = state.audioEnabled;
    }
    localVideo.srcObject = stream;
    localVideo.muted = true;
    localVideo.playsInline = true;
    updateStaticFields();
    await sendState();
    return stream;
  }

  // Applique le plafond de débit configuré à un émetteur WebRTC compatible.
  async function applySenderBitrate(sender) {
    if (!sender?.track || typeof sender.getParameters !== "function" || typeof sender.setParameters !== "function") {
      return;
    }
    const bitrates = BouCamPhoneServ.getSenderBitrates(getEffectiveMediaSettings());
    const parameters = sender.getParameters();
    if (!parameters.encodings?.length) {
      return;
    }
    parameters.encodings[0].maxBitrate = bitrates[sender.track.kind];
    try {
      await sender.setParameters(parameters);
    } catch (error) {
      console.warn(`Bitrate ${sender.track.kind} non appliqué par ce navigateur`, error);
    }
  }

  // Applique les plafonds vidéo et audio à tous les émetteurs d'une connexion.
  async function applyPeerBitrates(pc) {
    for (const sender of pc.getSenders()) {
      await applySenderBitrate(sender);
    }
  }

  // Crée la connexion WebRTC qui relie le téléphone au viewer.
  async function createPeerConnection(viewerId) {
    if (!viewerId || !state.stream) {
      return;
    }
    closePeerConnection(viewerId);
    const pc = new RTCPeerConnection({
      iceServers: [],
    });
    state.peers.set(viewerId, pc);

    for (const track of state.stream.getTracks()) {
      pc.addTrack(track, state.stream);
    }
    await applyPeerBitrates(pc);

    // Transmet chaque candidat ICE généré au serveur.
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal("ice", event.candidate.toJSON ? event.candidate.toJSON() : event.candidate, viewerId).catch(console.error);
      }
    };

    // Réagit aux changements d'état de la connexion WebRTC.
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setStatus("En direct", "good");
        setNetwork("Connecté", "good");
      } else if (pc.connectionState === "connecting") {
        setStatus("Connexion", "warn");
        setNetwork("Connexion", "warn");
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        closePeerConnection(viewerId);
        setNetwork(state.peers.size ? "Connecté" : "En attente", state.peers.size ? "good" : "warn");
      }
    };

    // Suit aussi l'état ICE pour maintenir le bon indicateur réseau.
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setNetwork("Connecté", "good");
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await sendSignal("offer", pc.localDescription, viewerId);
  }

  // Récupère et traite les messages de signalisation en attente.
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
        const viewerId = message.viewerId;
        const pc = viewerId ? state.peers.get(viewerId) : null;
        if (message.kind === "viewer-ready" && viewerId) {
          if (state.stream) {
            await createPeerConnection(viewerId);
          } else {
            state.waitingViewers.add(viewerId);
          }
        }
        if (message.kind === "viewer-left" && viewerId) {
          closePeerConnection(viewerId);
          state.waitingViewers.delete(viewerId);
        }
        if (message.kind === "answer" && pc) {
          await pc.setRemoteDescription(message.payload);
        }
        if (message.kind === "ice" && pc) {
          try {
            await pc.addIceCandidate(message.payload);
          } catch (error) {
            console.warn("ICE candidate rejected", error);
          }
        }
        if (message.kind === "command") {
          await handleCommand(message.payload || {});
        }
      }
      setNetwork(state.peers.size ? "Connecté" : "En attente", state.peers.size ? "good" : "warn");
    } catch (error) {
      console.error(error);
      setNetwork("Erreur de signalement", "danger");
    }
  }

  // Envoie périodiquement un battement de présence au serveur.
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

  // Exécute une commande distante envoyée depuis le viewer.
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

  // Démarre la session de diffusion si tout est prêt.
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
      state.active = true;
      setStatus("En direct", "good");
      setPermission("Autorisé", "good");
      setNetwork("Connecté", "good");
      setHint("La source est maintenant prête pour OBS.");
      await sendState({ status: "streaming" });
      for (const viewerId of state.waitingViewers) {
        await createPeerConnection(viewerId);
      }
      state.waitingViewers.clear();
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

  // Recrée le flux local avec la caméra et les réglages média effectifs.
  async function replaceMediaStream(nextFacing) {
    state.facingMode = nextFacing;

    const settings = getEffectiveMediaSettings();
    const constraints = BouCamPhoneServ.buildCaptureConstraints(settings);
    constraints.video.facingMode = { ideal: nextFacing };
    const nextStream = await navigator.mediaDevices.getUserMedia(constraints);

    const oldVideoTrack = state.stream.getVideoTracks()[0];
    const newVideoTrack = nextStream.getVideoTracks()[0];
    const oldAudioTrack = state.stream.getAudioTracks()[0];
    const newAudioTrack = nextStream.getAudioTracks()[0];

    for (const pc of state.peers.values()) {
      const videoSender = pc.getSenders().find((sender) => sender.track && sender.track.kind === "video");
      const audioSender = pc.getSenders().find((sender) => sender.track && sender.track.kind === "audio");
      if (videoSender && newVideoTrack) {
        await videoSender.replaceTrack(newVideoTrack);
      }
      if (audioSender && newAudioTrack) {
        await audioSender.replaceTrack(newAudioTrack);
      }
      await applyPeerBitrates(pc);
    }

    if (newAudioTrack) {
      newAudioTrack.enabled = state.audioEnabled;
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

  // Bascule entre caméra arrière et caméra frontale.
  async function switchCamera() {
    const nextFacing = state.facingMode === "environment" ? "user" : "environment";
    if (!state.stream) {
      state.facingMode = nextFacing;
      cameraValue.textContent = BouCamPhoneServ.describeFacingMode(state.facingMode);
      return;
    }
    await replaceMediaStream(nextFacing);
  }

  // Enregistre et applique les choix de qualité propres à ce téléphone.
  async function applyPhoneQuality() {
    const overrides = {};
    if (phoneVideoPresetInput.value) {
      overrides.videoPreset = phoneVideoPresetInput.value;
    }
    if (phoneFrameRateInput.value) {
      overrides.videoFrameRate = Number(phoneFrameRateInput.value);
    }
    if (phoneAudioBitrateInput.value) {
      overrides.audioBitrateKbps = Number(phoneAudioBitrateInput.value);
    }
    state.mediaOverrides = overrides;
    localStorage.setItem(mediaOverridesKey, JSON.stringify(overrides));
    applyPhoneQualityButton.disabled = true;
    phoneQualityHint.textContent = state.stream
      ? "Application de la qualité et reconnexion rapide de la caméra..."
      : "Qualité locale enregistrée. Elle sera utilisée au prochain démarrage.";
    try {
      if (state.stream) {
        await replaceMediaStream(state.facingMode);
      } else {
        for (const pc of state.peers.values()) {
          await applyPeerBitrates(pc);
        }
        await sendState();
      }
      syncPhoneQualityControls();
      updateStaticFields();
      phoneQualityHint.textContent = Object.keys(overrides).length
        ? "Les choix locaux remplacent les valeurs du serveur pour ce téléphone."
        : "Les réglages du serveur sont de nouveau utilisés.";
    } finally {
      applyPhoneQualityButton.disabled = false;
    }
  }

  // Active ou coupe le micro sans recréer la session.
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

  // Arrête proprement la session en cours.
  async function stopSession() {
    state.active = false;
    state.connecting = false;
    closeAllPeerConnections();
    stopStreamTracks();
    setStatus("Arrêté", "warn");
    setPermission("Permis", "warn");
    setNetwork("Déconnecté", "warn");
    setHint("Le flux a été arrêté. Tu peux redémarrer à tout moment.");
    await sendState({ status: "waiting", hasVideo: false }).catch(() => {});
    updateStaticFields();
  }

  // Enregistre le libellé personnalisé du téléphone.
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

  // Prépare la page téléphone et branche les actions utilisateur.
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
    state.bootstrap = await BouCamPhoneServ.fetchJson("/api/bootstrap");
    labelInput.value = localStorage.getItem(labelKey) || state.bootstrap?.settings?.defaultLabel || BouCamPhoneServ.deviceName();
    syncPhoneQualityControls();

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

    // Lance la diffusion depuis le bouton principal.
    startButton.addEventListener("click", () => startSession().catch((error) => {
      console.error(error);
      setStatus("Erreur", "danger");
      setHint(error.message || "Impossible de lancer la caméra.");
    }));

    // Change de caméra depuis le bouton dédié.
    switchButton.addEventListener("click", () => switchCamera().catch(console.error));
    // Coupe ou réactive le micro depuis l'interface.
    muteButton.addEventListener("click", () => toggleMicrophone().catch(console.error));
    // Arrête la diffusion depuis l'interface.
    stopButton.addEventListener("click", () => stopSession().catch(console.error));
    // Copie le lien direct de la session.
    copyLinkButton.addEventListener("click", async () => {
      await BouCamPhoneServ.copyText(window.location.href);
      copyLinkButton.textContent = "Lien copié";
      setTimeout(() => {
        copyLinkButton.textContent = "Copier le lien";
      }, 1200);
    });
    // Enregistre le libellé quand l'utilisateur valide.
    saveLabelButton.addEventListener("click", () => saveLabel().catch(console.error));
    // Sauvegarde le libellé dès qu'il change.
    labelInput.addEventListener("change", () => saveLabel().catch(console.error));
    // Applique les réglages vidéo et audio propres à ce téléphone.
    applyPhoneQualityButton.addEventListener("click", () => applyPhoneQuality().catch((error) => {
      console.error(error);
      phoneQualityHint.textContent = error.message || "Impossible d’appliquer cette qualité.";
      applyPhoneQualityButton.disabled = false;
    }));

    // Interroge la signalisation régulièrement pour rester réactif.
    state.pollTimer = setInterval(() => {
      pollLoop().catch(console.error);
    }, 350);
    // Envoie un battement de présence en arrière-plan.
    state.heartbeatTimer = setInterval(() => {
      heartbeatLoop().catch(console.error);
    }, 5000);

    await pollLoop();
    await heartbeatLoop();

    if (state.bootstrap?.settings?.autoStart) {
      setTimeout(() => {
        startSession().catch(console.error);
      }, 300);
    }
  }

  boot().catch((error) => {
    console.error(error);
    setStatus("Erreur", "danger");
    setHint(error.message || "Le démarrage a échoué.");
  });
})();
