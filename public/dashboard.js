// Initialise le tableau de bord de supervision et de contrôle.
(() => {
  const state = {
    bootstrap: null,
    sessions: [],
  };

  const elements = {
    phoneQrImage: document.getElementById("phoneQrImage"),
    phoneLinkText: document.getElementById("phoneLinkText"),
    phoneLinksList: document.getElementById("phoneLinksList"),
    phoneCountValue: document.getElementById("phoneCountValue"),
    activeCountValue: document.getElementById("activeCountValue"),
    viewerCountValue: document.getElementById("viewerCountValue"),
    networkCountValue: document.getElementById("networkCountValue"),
    copyPhoneLinkButton: document.getElementById("copyPhoneLinkButton"),
    openPhoneLinkButton: document.getElementById("openPhoneLinkButton"),
    copyAllObsButton: document.getElementById("copyAllObsButton"),
    refreshButton: document.getElementById("refreshButton"),
    refreshButtonSecondary: document.getElementById("refreshButtonSecondary"),
    copyCertUrlButton: document.getElementById("copyCertUrlButton"),
    sessionList: document.getElementById("sessionList"),
    sessionCount: document.getElementById("sessionCount"),
    serverState: document.getElementById("serverState"),
    configSummary: document.getElementById("configSummary"),
    configStatus: document.getElementById("configStatus"),
    configObsLink: document.getElementById("configObsLink"),
  };

  // Génère l'URL d'un QR code pour le texte fourni.
  function qrSrc(text, size = 240) {
    return `/api/qr?text=${encodeURIComponent(text)}&size=${size}`;
  }

  // Retourne l'URL téléphone à afficher en priorité.
  function getPhoneUrl() {
    return state.bootstrap?.urls?.phoneUrls?.[0] || `${window.location.origin}/phone`;
  }

  // Construit l'URL de vue OBS pour une session donnée.
  function getObsUrl(sessionId) {
    return `${window.location.origin}/view/${sessionId}?clean=1`;
  }

  // Réinitialise le libellé d'un bouton après une copie.
  function setClipboardButtonLabel(button, label = "Copier", defaultLabel = button.dataset.defaultLabel || button.textContent) {
    button.textContent = label;
    setTimeout(() => {
      button.textContent = defaultLabel;
    }, 1200);
  }

  // Branche un bouton de copie sur un texte fourni à la demande.
  async function bindCopyButton(button, textProvider, defaultLabel = "Copier") {
    button.dataset.defaultLabel = defaultLabel;
    button.textContent = defaultLabel;
    button.addEventListener("click", async () => {
      await BouCamPhoneServ.copyText(await textProvider());
      setClipboardButtonLabel(button, "Copié");
    });
  }

  // Affiche les accès disponibles pour rejoindre le téléphone.
  function renderPhoneAccess() {
    const phoneUrl = getPhoneUrl();
    elements.phoneQrImage.src = qrSrc(phoneUrl, 360);
    elements.phoneQrImage.alt = `QR code vers ${phoneUrl}`;
    elements.phoneLinkText.textContent = phoneUrl;
    elements.openPhoneLinkButton.href = phoneUrl;

    elements.phoneLinksList.replaceChildren();

    const urls = state.bootstrap?.urls?.phoneUrls || [];
    if (!urls.length) {
      const empty = document.createElement("div");
      empty.className = "session-card";
      empty.innerHTML = `
        <div class="session-top">
          <div>
            <h3 class="session-title">Aucune adresse détectée</h3>
            <p class="session-id">Le serveur n’a pas encore trouvé d’adresse LAN exploitable.</p>
          </div>
        </div>
      `;
      elements.phoneLinksList.appendChild(empty);
      return;
    }

    urls.forEach((url, index) => {
      const row = document.createElement("div");
      row.className = "session-card";
      row.innerHTML = `
        <div class="session-top">
          <div>
            <h3 class="session-title">Adresse ${index + 1}</h3>
            <p class="session-id">${url}</p>
          </div>
          ${index === 0 ? '<span class="chip good">Recommandé</span>' : ""}
        </div>
        <div class="card-actions">
          <button class="button-secondary" type="button">Copier</button>
          <a class="button-ghost" href="${url}" target="_blank" rel="noreferrer">Ouvrir</a>
        </div>
      `;

      // Copie l'adresse locale choisie dans le presse-papiers.
      row.querySelector("button").addEventListener("click", async () => {
        await BouCamPhoneServ.copyText(url);
        setClipboardButtonLabel(row.querySelector("button"), "Copié");
      });

      elements.phoneLinksList.appendChild(row);
    });
  }

  // Met à jour les compteurs globaux affichés en haut de page.
  function renderSummary() {
    const total = state.sessions.length;
    const activePhones = state.sessions.filter((session) => session.publisherOnline).length;
    const connectedViewers = state.sessions.filter((session) => session.viewerOnline).length;
    const lanCount = state.bootstrap?.urls?.lanAddresses?.length || 0;

    elements.phoneCountValue.textContent = `${total}`;
    elements.activeCountValue.textContent = `${activePhones}`;
    elements.viewerCountValue.textContent = `${connectedViewers}`;
    elements.networkCountValue.textContent = `${lanCount || 1} LAN`;
    elements.sessionCount.textContent = `${total} appareil${total > 1 ? "s" : ""}`;
  }

  // Affiche les réglages graphiques actifs du serveur.
  function renderConfig() {
    const settings = state.bootstrap?.settings || {};
    const summary = [
      ["Nom par défaut", settings.defaultLabel || "Phone"],
      ["Caméra", BouCamPhoneServ.describeFacingMode(settings.preferredFacingMode || "environment")],
      ["Qualité", BouCamPhoneServ.describeVideoPreset(settings.videoPreset || "1080p")],
      ["Auto-démarrage", settings.autoStart ? "Activé" : "Désactivé"],
      ["Micro au départ", settings.startMuted ? "Muet" : "Ouvert"],
      ["Vue propre", settings.cleanViewer ? "Oui" : "Non"],
    ];

    elements.configSummary.replaceChildren();
    for (const [key, value] of summary) {
      const item = document.createElement("div");
      item.className = "key-value";
      item.innerHTML = `
        <span class="key">${key}</span>
        <span class="value">${value}</span>
      `;
      elements.configSummary.appendChild(item);
    }

    if (elements.configStatus) {
      elements.configStatus.textContent = settings ? "Synchronisé" : "Par défaut";
    }

    if (elements.configObsLink) {
      const latestSession = state.sessions[0];
      elements.configObsLink.href = latestSession ? getObsUrl(latestSession.id) : `${window.location.origin}/view?clean=1`;
    }
  }

  // Reconstruit la liste détaillée des sessions actives.
  function renderSessions() {
    elements.sessionList.replaceChildren();

    if (!state.sessions.length) {
      const empty = document.createElement("div");
      empty.className = "session-card";
      empty.innerHTML = `
        <div class="session-top">
          <div>
            <h3 class="session-title">Aucun téléphone pour le moment</h3>
            <p class="session-id">Ouvre le lien téléphone sur un mobile pour faire apparaître sa carte.</p>
          </div>
        </div>
      `;
      elements.sessionList.appendChild(empty);
      return;
    }

    for (const session of state.sessions) {
      const card = document.createElement("article");
      card.className = "session-card";

      const statusTone =
        session.state === "live" || session.state === "streaming"
          ? "good"
          : session.state === "error"
            ? "danger"
            : "warn";
      const statusLabel =
        session.state === "live" || session.state === "streaming"
          ? "En diffusion"
          : session.state === "error"
            ? "Erreur"
            : "En attente";
      const viewUrl = getObsUrl(session.id);
      const microphoneLabel = session.hasAudio ? "Activé" : "Coupé";
      const cameraLabel = session.facingMode || "environment";
      const phoneTone = session.publisherOnline ? "good" : "danger";
      const viewerTone = session.viewerOnline ? "good" : "warn";

      card.innerHTML = `
        <div class="session-top">
          <div>
            <h3 class="session-title">${session.label}</h3>
            <p class="session-id">ID ${session.id} · créé le ${BouCamPhoneServ.formatDateTime(session.createdAt)}</p>
          </div>
          <span class="chip ${statusTone}">${statusLabel}</span>
        </div>
        <div class="stats">
          <div class="key-value">
            <span class="key">Téléphone</span>
            <span class="value">${session.publisherOnline ? "Connecté" : "Hors ligne"} · ${BouCamPhoneServ.formatRelative(session.publisherSeenAt)}</span>
          </div>
          <div class="key-value">
            <span class="key">OBS / viewer</span>
            <span class="value">${session.viewerOnline ? "Connecté" : "En attente"} · ${BouCamPhoneServ.formatRelative(session.viewerSeenAt)}</span>
          </div>
          <div class="key-value">
            <span class="key">Caméra</span>
            <span class="value">${cameraLabel}</span>
          </div>
          <div class="key-value">
            <span class="key">Audio</span>
            <span class="value">${microphoneLabel}</span>
          </div>
        </div>
        <div class="session-qr-row">
          <img class="qr-image qr-image-small" alt="QR code OBS pour ${session.label}" src="${qrSrc(viewUrl, 180)}" />
          <div class="session-qr-copy">
            <span class="key">Lien OBS</span>
            <span class="inline-url">${viewUrl}</span>
            <div class="card-actions">
              <button class="button-secondary" data-action="copy" type="button">Copier le lien OBS</button>
              <a class="button-ghost" href="${viewUrl}" target="_blank" rel="noreferrer">Ouvrir</a>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="card-actions">
          <button class="button-secondary" data-action="rename" type="button">Renommer</button>
          <button class="button-secondary" data-action="flip" type="button">Changer caméra</button>
          <button class="button-secondary" data-action="mute" type="button">${session.hasAudio ? "Couper le micro" : "Réactiver le micro"}</button>
          <button class="button-secondary" data-action="stop" type="button">Arrêter</button>
        </div>
      `;

      const copyButton = card.querySelector('[data-action="copy"]');
      // Copie le lien OBS de la session courante.
      copyButton.addEventListener("click", async () => {
        await BouCamPhoneServ.copyText(viewUrl);
        setClipboardButtonLabel(copyButton, "Copié");
      });

      // Demande un nouveau nom pour la session sélectionnée.
      card.querySelector('[data-action="rename"]').addEventListener("click", async () => {
        const next = prompt("Nouveau nom du téléphone", session.label);
        if (!next || !next.trim()) {
          return;
        }

        await BouCamPhoneServ.fetchJson(`/api/sessions/${session.id}/state`, {
          method: "POST",
          body: JSON.stringify({
            role: "dashboard",
            label: next.trim(),
            status: session.state,
          }),
        });
        await refresh();
      });

      // Envoie la commande pour changer la caméra du téléphone.
      card.querySelector('[data-action="flip"]').addEventListener("click", async () => {
        await BouCamPhoneServ.fetchJson(`/api/sessions/${session.id}/messages`, {
          method: "POST",
          body: JSON.stringify({
            from: "viewer",
            messages: [
              {
                kind: "command",
                payload: { action: "switchCamera" },
              },
            ],
          }),
        });
        await refresh();
      });

      // Envoie la commande pour couper ou réactiver le micro.
      card.querySelector('[data-action="mute"]').addEventListener("click", async () => {
        await BouCamPhoneServ.fetchJson(`/api/sessions/${session.id}/messages`, {
          method: "POST",
          body: JSON.stringify({
            from: "viewer",
            messages: [
              {
                kind: "command",
                payload: { action: "toggleMicrophone" },
              },
            ],
          }),
        });
        await refresh();
      });

      // Envoie la commande pour arrêter la session en cours.
      card.querySelector('[data-action="stop"]').addEventListener("click", async () => {
        await BouCamPhoneServ.fetchJson(`/api/sessions/${session.id}/messages`, {
          method: "POST",
          body: JSON.stringify({
            from: "viewer",
            messages: [
              {
                kind: "command",
                payload: { action: "stop" },
              },
            ],
          }),
        });
        await refresh();
      });

      elements.sessionList.appendChild(card);
    }
  }

  // Recharge les données serveur puis rafraîchit l'interface.
  async function refresh() {
    const [bootstrap, sessions] = await Promise.all([
      BouCamPhoneServ.fetchJson("/api/bootstrap"),
      BouCamPhoneServ.fetchJson("/api/sessions"),
    ]);

    state.bootstrap = bootstrap;
    state.sessions = sessions.items || [];

    renderPhoneAccess();
    renderSummary();
    renderConfig();
    renderSessions();
  }

  // Affiche une erreur serveur dans la barre d'état.
  function reportError(error) {
    console.error(error);
    elements.serverState.textContent = "Hors ligne";
    elements.serverState.className = "chip danger";
  }

  // Lance le tableau de bord et branche les actions utilisateur.
  async function boot() {
    elements.copyPhoneLinkButton.dataset.defaultLabel = elements.copyPhoneLinkButton.textContent;
    elements.copyAllObsButton.dataset.defaultLabel = elements.copyAllObsButton.textContent;
    elements.copyCertUrlButton.dataset.defaultLabel = elements.copyCertUrlButton.textContent;

    // Copie le lien téléphone principal.
    elements.copyPhoneLinkButton.addEventListener("click", async () => {
      await BouCamPhoneServ.copyText(getPhoneUrl());
      setClipboardButtonLabel(elements.copyPhoneLinkButton, "Copié");
    });

    // Copie tous les liens OBS visibles dans la liste.
    elements.copyAllObsButton.addEventListener("click", async () => {
      const links = state.sessions.map((session) => getObsUrl(session.id));
      if (!links.length) {
        setClipboardButtonLabel(elements.copyAllObsButton, "Aucun lien");
        return;
      }
      await BouCamPhoneServ.copyText(links.join("\n"));
      setClipboardButtonLabel(elements.copyAllObsButton, "Copié");
    });

    // Rafraîchit le tableau de bord depuis le bouton principal.
    elements.refreshButton.addEventListener("click", () => {
      refresh().catch(reportError);
    });
    // Rafraîchit le tableau de bord depuis le bouton secondaire.
    elements.refreshButtonSecondary.addEventListener("click", () => {
      refresh().catch(reportError);
    });
    // Copie l'URL du certificat local pour l'installation manuelle.
    elements.copyCertUrlButton.addEventListener("click", async () => {
      const url = state.bootstrap?.urls?.certDownload || `${window.location.origin}/downloads/local.cer`;
      await BouCamPhoneServ.copyText(url);
      setClipboardButtonLabel(elements.copyCertUrlButton, "Lien copié");
    });

    try {
      await refresh();
    } catch (error) {
      reportError(error);
    }

    // Rafraîchit automatiquement les données toutes les quelques secondes.
    setInterval(() => {
      refresh().catch(reportError);
    }, 2500);
  }

  boot();
})();
