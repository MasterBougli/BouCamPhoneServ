// Initialise les utilitaires communs utilisés par toutes les pages.
window.BouCamPhoneServ = (() => {
  // Envoie une requête JSON et renvoie la réponse parsée.
  async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      const message = data && data.error ? data.error : `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data;
  }

  // Formate une date pour un affichage lisible par l'utilisateur.
  function formatDateTime(value) {
    if (!value) {
      return "never";
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  // Formate un horodatage en durée relative.
  function formatRelative(value) {
    if (!value) {
      return "never";
    }
    const diff = Date.now() - value;
    const seconds = Math.round(diff / 1000);
    if (seconds < 5) {
      return "just now";
    }
    if (seconds < 60) {
      return `${seconds}s ago`;
    }
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.round(minutes / 60);
    return `${hours}h ago`;
  }

  // Crée un badge visuel réutilisable dans l'interface.
  function createChip(label, tone = "") {
    const chip = document.createElement("span");
    chip.className = `chip ${tone}`.trim();
    chip.textContent = label;
    return chip;
  }

  // Copie du texte dans le presse-papiers en privilégiant l'API moderne.
  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  // Contraint une valeur dans une plage minimale et maximale.
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // Devine un nom d'appareil simple à partir du navigateur.
  function deviceName() {
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) {
      return "iPhone";
    }
    if (/Android/i.test(ua)) {
      return "Android";
    }
    return "Phone";
  }

  // Décrit l'orientation de caméra retenue dans l'interface.
  function describeFacingMode(mode) {
    return mode === "user" ? "Caméra frontale" : "Caméra arrière";
  }

  // Décrit un preset vidéo en langage humain.
  function describeVideoPreset(preset) {
    switch (preset) {
      case "720p":
        return "720p léger";
      case "1440p":
        return "1440p haute qualité";
      default:
        return "1080p équilibré";
    }
  }

  // Retourne les contraintes média adaptées aux réglages choisis.
  function buildCaptureConstraints(settings = {}) {
    const facingMode = settings.preferredFacingMode === "user" ? "user" : "environment";
    const preset = settings.videoPreset === "720p" || settings.videoPreset === "1440p" ? settings.videoPreset : "1080p";
    const video =
      preset === "720p"
        ? { width: { ideal: 1280 }, height: { ideal: 720 } }
        : preset === "1440p"
          ? { width: { ideal: 2560 }, height: { ideal: 1440 } }
          : { width: { ideal: 1920 }, height: { ideal: 1080 } };

    return {
      audio: true,
      video: {
        facingMode: { ideal: facingMode },
        ...video,
      },
    };
  }

  return {
    fetchJson,
    formatDateTime,
    formatRelative,
    createChip,
    copyText,
    clamp,
    deviceName,
    describeFacingMode,
    describeVideoPreset,
    buildCaptureConstraints,
  };
})();
