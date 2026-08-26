// Initialise la page de configuration graphique du serveur.
(() => {
  const state = {
    bootstrap: null,
    settings: null,
    dirty: false,
  };

  const elements = {
    form: document.getElementById("settingsForm"),
    defaultLabelInput: document.getElementById("defaultLabelInput"),
    preferredFacingModeInput: document.getElementById("preferredFacingModeInput"),
    videoPresetInput: document.getElementById("videoPresetInput"),
    autoStartInput: document.getElementById("autoStartInput"),
    startMutedInput: document.getElementById("startMutedInput"),
    cleanViewerInput: document.getElementById("cleanViewerInput"),
    saveButton: document.getElementById("saveButton"),
    resetButton: document.getElementById("resetButton"),
    reloadButton: document.getElementById("reloadButton"),
    configState: document.getElementById("configState"),
    summaryState: document.getElementById("summaryState"),
    settingsSummary: document.getElementById("settingsSummary"),
    linksList: document.getElementById("linksList"),
    configHint: document.getElementById("configHint"),
  };

  // Met à jour les badges d'état de la page.
  function setStatus(text, tone = "warn") {
    elements.configState.className = `chip ${tone}`.trim();
    elements.configState.textContent = text;
    elements.summaryState.className = `chip ${tone}`.trim();
    elements.summaryState.textContent = text;
  }

  // Lit les valeurs du formulaire pour produire un objet de configuration.
  function readForm() {
    return {
      defaultLabel: elements.defaultLabelInput.value.trim() || "Phone",
      preferredFacingMode: elements.preferredFacingModeInput.value === "user" ? "user" : "environment",
      videoPreset: ["720p", "1080p", "1440p"].includes(elements.videoPresetInput.value)
        ? elements.videoPresetInput.value
        : "1080p",
      autoStart: elements.autoStartInput.checked,
      startMuted: elements.startMutedInput.checked,
      cleanViewer: elements.cleanViewerInput.checked,
    };
  }

  // Remplit le formulaire avec les valeurs reçues du serveur.
  function fillForm(settings) {
    const safe = settings || {};
    elements.defaultLabelInput.value = safe.defaultLabel || "Phone";
    elements.preferredFacingModeInput.value = safe.preferredFacingMode === "user" ? "user" : "environment";
    elements.videoPresetInput.value = ["720p", "1080p", "1440p"].includes(safe.videoPreset)
      ? safe.videoPreset
      : "1080p";
    elements.autoStartInput.checked = Boolean(safe.autoStart);
    elements.startMutedInput.checked = Boolean(safe.startMuted);
    elements.cleanViewerInput.checked = safe.cleanViewer === undefined ? true : Boolean(safe.cleanViewer);
  }

  // Génère une ligne récapitulative pour le panneau de résumé.
  function createSummaryItem(label, value) {
    const item = document.createElement("div");
    item.className = "key-value";
    item.innerHTML = `
      <span class="key">${label}</span>
      <span class="value">${value}</span>
    `;
    return item;
  }

  // Affiche le résumé des réglages actuellement saisis.
  function renderSummary() {
    const current = readForm();
    const rows = [
      ["Nom par défaut", current.defaultLabel],
      ["Caméra", BouCamPhoneServ.describeFacingMode(current.preferredFacingMode)],
      ["Qualité", BouCamPhoneServ.describeVideoPreset(current.videoPreset)],
      ["Auto-démarrage", current.autoStart ? "Activé" : "Désactivé"],
      ["Micro au départ", current.startMuted ? "Muet" : "Ouvert"],
      ["Vue OBS", current.cleanViewer ? "Épurée" : "Complète"],
    ];

    elements.settingsSummary.replaceChildren();
    for (const [label, value] of rows) {
      elements.settingsSummary.appendChild(createSummaryItem(label, value));
    }
  }

  // Copie un texte et actualise le libellé du bouton associé.
  async function copyWithFeedback(button, text) {
    const defaultLabel = button.dataset.defaultLabel || button.textContent;
    await BouCamPhoneServ.copyText(text);
    button.textContent = "Copié";
    setTimeout(() => {
      button.textContent = defaultLabel;
    }, 1200);
  }

  // Construit les raccourcis utiles vers les pages principales.
  function renderLinks() {
    const urls = state.bootstrap?.urls || {};
    const entries = [
      {
        label: "Tableau de bord",
        description: "Vue principale pour suivre les téléphones et les sources OBS.",
        display: urls.dashboardLocal || `${window.location.origin}/dashboard`,
        url: urls.dashboardLocal || `${window.location.origin}/dashboard`,
        icon: "⌂",
        kind: "open",
        openLabel: "Ouvrir",
        copyLabel: "Copier le lien",
      },
      {
        label: "Page téléphone",
        description: "Lien direct à ouvrir sur chaque mobile du réseau local.",
        display: urls.phoneUrls?.[0] || `${window.location.origin}/phone`,
        url: urls.phoneUrls?.[0] || `${window.location.origin}/phone`,
        icon: "◔",
        kind: "open",
        openLabel: "Ouvrir",
        copyLabel: "Copier le lien",
      },
      {
        label: "Configuration",
        description: "Page graphique de réglage des options partagées.",
        display: urls.configLocal || `${window.location.origin}/config`,
        url: urls.configLocal || `${window.location.origin}/config`,
        icon: "⚙",
        kind: "open",
        openLabel: "Ouvrir",
        copyLabel: "Copier le lien",
      },
      {
        label: "Certificat public",
        description: "Fichier à installer sur les téléphones pour la connexion HTTPS.",
        display: urls.certDownload || `${window.location.origin}/downloads/local.cer`,
        url: urls.certDownload || `${window.location.origin}/downloads/local.cer`,
        icon: "⇩",
        kind: "open",
        openLabel: "Télécharger",
        copyLabel: "Copier le lien",
      },
      {
        label: "Commande de lancement",
        description: "Ouvre la configuration graphique depuis le terminal Windows.",
        display: "npm run config",
        url: "npm run config",
        icon: "⌘",
        kind: "copy",
        copyLabel: "Copier la commande",
      },
      {
        label: "Lanceur Windows",
        description: "Télécharge le fichier .cmd pour un double-clic local.",
        display: urls.configLauncher || `${window.location.origin}/downloads/open-config.cmd`,
        url: urls.configLauncher || `${window.location.origin}/downloads/open-config.cmd`,
        icon: "▣",
        kind: "open",
        openLabel: "Télécharger",
        copyLabel: "Copier le lien",
      },
    ];

    elements.linksList.replaceChildren();
    for (const entry of entries) {
      const row = document.createElement("div");
      row.className = "config-link-item";
      row.innerHTML = `
        <div class="config-link-icon">${entry.icon}</div>
        <div class="config-link-text">
          <strong>${entry.label}</strong>
          <span>${entry.description}</span>
          <span class="config-command">${entry.display}</span>
        </div>
        <div class="card-actions">
          ${entry.kind === "open" ? `<a class="button-ghost" href="${entry.url}" target="_blank" rel="noreferrer">${entry.openLabel || "Ouvrir"}</a>` : ""}
          <button class="button-secondary" type="button">${entry.copyLabel || "Copier"}</button>
        </div>
      `;

      const copyButton = row.querySelector("button");
      copyButton.dataset.defaultLabel = entry.copyLabel || "Copier";
      copyButton.addEventListener("click", async () => {
        await copyWithFeedback(copyButton, entry.url);
      });

      elements.linksList.appendChild(row);
    }
  }

  // Recharge l'état du serveur puis réaffiche la page.
  async function loadSettings() {
    const bootstrap = await BouCamPhoneServ.fetchJson("/api/bootstrap");
    state.bootstrap = bootstrap;
    state.settings = bootstrap.settings || {};
    fillForm(state.settings);
    state.dirty = false;
    setStatus("Synchronisé", "good");
    renderSummary();
    renderLinks();
    elements.configHint.textContent = "Les réglages sont déjà actifs sur le serveur. Utilise les raccourcis ci-contre pour ouvrir ou lancer la configuration.";
  }

  // Sauvegarde les réglages saisis dans le formulaire.
  async function saveSettings(event) {
    event.preventDefault();
    setStatus("Application...", "warn");
    const response = await BouCamPhoneServ.fetchJson("/api/settings", {
      method: "POST",
      body: JSON.stringify(readForm()),
    });

    state.settings = response.settings || readForm();
    fillForm(state.settings);
    state.dirty = false;
    setStatus("Appliqué", "good");
    renderSummary();
    renderLinks();
    elements.configHint.textContent = "La configuration a été appliquée immédiatement sur le serveur local.";
  }

  // Marque l'interface comme modifiée dès qu'un champ change.
  function markDirty() {
    state.dirty = true;
    setStatus("Modifié", "warn");
    renderSummary();
    elements.configHint.textContent = "Des changements sont en attente d’enregistrement.";
  }

  // Lance la page de configuration et branche les événements.
  async function boot() {
    elements.saveButton.dataset.defaultLabel = elements.saveButton.textContent;
    elements.reloadButton.dataset.defaultLabel = elements.reloadButton.textContent;

    elements.form.addEventListener("submit", (event) => {
      saveSettings(event).catch((error) => {
        console.error(error);
        setStatus("Erreur", "danger");
        elements.configHint.textContent = error.message || "Impossible d'enregistrer les réglages.";
      });
    });

    elements.resetButton.addEventListener("click", () => {
      loadSettings().catch((error) => {
        console.error(error);
        setStatus("Erreur", "danger");
        elements.configHint.textContent = error.message || "Impossible de recharger la configuration.";
      });
    });

    elements.reloadButton.addEventListener("click", () => {
      loadSettings().catch((error) => {
        console.error(error);
        setStatus("Erreur", "danger");
        elements.configHint.textContent = error.message || "Impossible de recharger la configuration.";
      });
    });

    for (const input of [
      elements.defaultLabelInput,
      elements.preferredFacingModeInput,
      elements.videoPresetInput,
      elements.autoStartInput,
      elements.startMutedInput,
      elements.cleanViewerInput,
    ]) {
      input.addEventListener("input", markDirty);
      input.addEventListener("change", markDirty);
    }

    try {
      await loadSettings();
    } catch (error) {
      console.error(error);
      setStatus("Erreur", "danger");
      elements.configHint.textContent = error.message || "Impossible de charger la configuration.";
    }
  }

  boot().catch((error) => {
    console.error(error);
    setStatus("Erreur", "danger");
    elements.configHint.textContent = error.message || "Le démarrage a échoué.";
  });
})();
