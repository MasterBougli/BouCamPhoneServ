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
    videoFrameRateInput: document.getElementById("videoFrameRateInput"),
    audioBitrateInput: document.getElementById("audioBitrateInput"),
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

  const icons = {
    dashboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 18h2"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
    terminal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/></svg>',
    windows: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5 10.5 4v7H3zM13 3.6 21 2v9h-8zM3 13h7.5v7L3 18.5zM13 13h8v9l-8-1.6z"/></svg>',
    mosaic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>',
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
      videoPreset: elements.videoPresetInput.value,
      videoFrameRate: Number(elements.videoFrameRateInput.value),
      audioBitrateKbps: Number(elements.audioBitrateInput.value),
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
    const legacyVideoPresets = { "720p": "720p-low", "1080p": "1080p-balanced", "1440p": "1440p-high" };
    const supportedVideoPresets = [
      "720p-low",
      "720p-balanced",
      "720p-high",
      "1080p-low",
      "1080p-balanced",
      "1080p-high",
      "1440p-high",
    ];
    const normalizedVideoPreset = legacyVideoPresets[safe.videoPreset] || safe.videoPreset;
    elements.videoPresetInput.value = supportedVideoPresets.includes(normalizedVideoPreset)
      ? normalizedVideoPreset
      : "1080p-balanced";
    elements.audioBitrateInput.value = [32, 48, 64].includes(Number(safe.audioBitrateKbps))
      ? String(safe.audioBitrateKbps)
      : "48";
    elements.videoFrameRateInput.value = [15, 24, 30, 60].includes(Number(safe.videoFrameRate))
      ? String(safe.videoFrameRate)
      : "30";
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
      ["Fluidité", `${current.videoFrameRate} FPS`],
      ["Audio", `${current.audioBitrateKbps} kbps`],
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
        icon: icons.dashboard,
        kind: "open",
        openLabel: "Ouvrir",
        copyLabel: "Copier le lien",
      },
      {
        label: "Mosaïque",
        description: "Supervision simultanée de toutes les caméras actives.",
        display: urls.mosaicLocal || `${window.location.origin}/mosaic`,
        url: urls.mosaicLocal || `${window.location.origin}/mosaic`,
        icon: icons.mosaic,
        kind: "open",
        openLabel: "Ouvrir",
        copyLabel: "Copier le lien",
      },
      {
        label: "Page téléphone",
        description: "Lien direct à ouvrir sur chaque mobile du réseau local.",
        display: urls.phoneUrls?.[0] || `${window.location.origin}/phone`,
        url: urls.phoneUrls?.[0] || `${window.location.origin}/phone`,
        icon: icons.phone,
        kind: "open",
        openLabel: "Ouvrir",
        copyLabel: "Copier le lien",
      },
      {
        label: "Configuration",
        description: "Page graphique de réglage des options partagées.",
        display: urls.configLocal || `${window.location.origin}/config`,
        url: urls.configLocal || `${window.location.origin}/config`,
        icon: icons.settings,
        kind: "open",
        openLabel: "Ouvrir",
        copyLabel: "Copier le lien",
      },
      {
        label: "Certificat public",
        description: "Fichier facultatif qui évite l’avertissement HTTPS non reconnu.",
        display: urls.certDownload || `${window.location.origin}/downloads/local.cer`,
        url: urls.certDownload || `${window.location.origin}/downloads/local.cer`,
        icon: icons.download,
        kind: "open",
        openLabel: "Télécharger",
        copyLabel: "Copier le lien",
      },
      {
        label: "Commande de lancement",
        description: "Ouvre la configuration graphique depuis le terminal Windows.",
        display: "npm run config",
        url: "npm run config",
        icon: icons.terminal,
        kind: "copy",
        copyLabel: "Copier la commande",
      },
      {
        label: "Lanceur Windows",
        description: "Télécharge le fichier .cmd pour un double-clic local.",
        display: urls.configLauncher || `${window.location.origin}/downloads/open-config.cmd`,
        url: urls.configLauncher || `${window.location.origin}/downloads/open-config.cmd`,
        icon: icons.windows,
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
        <div class="config-link-icon" aria-hidden="true">${entry.icon}</div>
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
    setStatus("Ok", "good");
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

  // Affiche uniquement le panneau associé à l'onglet sélectionné.
  function activateSectionTab(sectionId, updateHash = false) {
    const tabs = [...document.querySelectorAll(".rail-nav-item")];
    const panels = [...document.querySelectorAll('[role="tabpanel"]')];
    for (const tab of tabs) {
      const active = tab.getAttribute("href") === `#${sectionId}`;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    }
    for (const panel of panels) {
      panel.hidden = panel.id !== sectionId;
    }
    if (updateHash) {
      history.replaceState(null, "", `#${sectionId}`);
    }
  }

  // Branche les clics et le clavier sur les vrais onglets de configuration.
  function setupSectionTabs() {
    const tabs = [...document.querySelectorAll(".rail-nav-item")];
    const requestedSection = window.location.hash.slice(1);
    const initialSection = document.getElementById(requestedSection)?.matches('[role="tabpanel"]')
      ? requestedSection
      : "network-section";
    for (const [index, tab] of tabs.entries()) {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        activateSectionTab(tab.getAttribute("href").slice(1), true);
        document.querySelector(".config-main")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
          return;
        }
        event.preventDefault();
        const nextIndex = event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index + (["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        activateSectionTab(tabs[nextIndex].getAttribute("href").slice(1), true);
      });
    }
    activateSectionTab(initialSection);
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
      elements.videoFrameRateInput,
      elements.audioBitrateInput,
      elements.autoStartInput,
      elements.startMutedInput,
      elements.cleanViewerInput,
    ]) {
      input.addEventListener("input", markDirty);
      input.addEventListener("change", markDirty);
    }
    setupSectionTabs();

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
