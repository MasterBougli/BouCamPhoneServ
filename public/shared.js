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
      case "720p-low":
        return "720p basse qualité";
      case "720p-balanced":
        return "720p équilibré";
      case "720p-high":
        return "720p haute qualité";
      case "1080p-low":
        return "1080p basse qualité";
      case "1080p-high":
        return "1080p haute qualité";
      case "1440p":
      case "1440p-high":
        return "1440p haute qualité";
      default:
        return "1080p équilibré";
    }
  }

  // Retourne la résolution et le débit vidéo ciblés par un profil de qualité.
  function getVideoProfile(preset) {
    const profiles = {
      "720p-low": { width: 1280, height: 720, bitrateKbps: 1000 },
      "720p-balanced": { width: 1280, height: 720, bitrateKbps: 2500 },
      "720p-high": { width: 1280, height: 720, bitrateKbps: 4000 },
      "1080p-low": { width: 1920, height: 1080, bitrateKbps: 2500 },
      "1080p-balanced": { width: 1920, height: 1080, bitrateKbps: 5000 },
      "1080p-high": { width: 1920, height: 1080, bitrateKbps: 8000 },
      "1440p-high": { width: 2560, height: 1440, bitrateKbps: 12000 },
    };
    const legacy = { "720p": "720p-low", "1080p": "1080p-balanced", "1440p": "1440p-high" };
    return profiles[legacy[preset] || preset] || profiles["1080p-balanced"];
  }

  // Retourne les plafonds de débit WebRTC exprimés en bits par seconde.
  function getSenderBitrates(settings = {}) {
    const audioKbps = [32, 48, 64].includes(Number(settings.audioBitrateKbps))
      ? Number(settings.audioBitrateKbps)
      : 48;
    return {
      video: getVideoProfile(settings.videoPreset).bitrateKbps * 1000,
      audio: audioKbps * 1000,
    };
  }

  // Retourne les contraintes média adaptées aux réglages choisis.
  function buildCaptureConstraints(settings = {}) {
    const facingMode = settings.preferredFacingMode === "user" ? "user" : "environment";
    const profile = getVideoProfile(settings.videoPreset);

    return {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: profile.width },
        height: { ideal: profile.height },
        frameRate: { ideal: 30, max: 30 },
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
    getVideoProfile,
    getSenderBitrates,
    buildCaptureConstraints,
  };
})();
