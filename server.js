const fs = require("fs");
const http = require("http");
const https = require("https");
const os = require("os");
const path = require("path");
const { randomUUID } = require("crypto");
const { spawnSync } = require("child_process");
const QRCode = require("qrcode");

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const CONFIG_DIR = path.join(ROOT, "config");
const SETTINGS_FILE = path.join(CONFIG_DIR, "settings.json");
const CERT_DIR = path.join(ROOT, "certs");
const CERT_PFX = process.env.CAMFROMPHONE_TLS_PFX || path.join(CERT_DIR, "local.pfx");
const CERT_PASSWORD = process.env.CAMFROMPHONE_TLS_PASSWORD || "camfromphone";
const HTTP_PORT = Number(process.env.HTTP_PORT || 8080);
const HTTPS_PORT = Number(process.env.HTTPS_PORT || 8443);
const HOST = process.env.HOST || "0.0.0.0";
const HEARTBEAT_TTL_MS = 15_000;
const MESSAGE_LIMIT = 250;
const DEFAULT_SETTINGS = {
  defaultLabel: "Phone",
  preferredFacingMode: "environment",
  videoPreset: "1080p",
  startMuted: false,
  autoStart: false,
  cleanViewer: true,
};

const sessions = new Map();
let settings = loadSettings();

// Prépare le certificat auto-signé utilisé par le serveur HTTPS local.
function ensureCertificate() {
  if (fs.existsSync(CERT_PFX)) {
    return;
  }

  const script = path.join(ROOT, "scripts", "create-local-cert.ps1");
  if (process.platform !== "win32") {
    throw new Error(
      `Missing TLS certificate: ${CERT_PFX}. Create one with the script in scripts/create-local-cert.ps1 or point CAMFROMPHONE_TLS_PFX to an existing .pfx file.`
    );
  }

  console.log("[cert] Creating local certificate...");
  const result = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      script,
      "-OutputDir",
      CERT_DIR,
      "-Password",
      CERT_PASSWORD,
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0 || !fs.existsSync(CERT_PFX)) {
    throw new Error("Unable to create the local TLS certificate.");
  }
}

// Normalise les réglages de l'application avant de les utiliser.
function normalizeSettings(input) {
  const source = input && typeof input === "object" ? input : {};
  const defaultLabel = typeof source.defaultLabel === "string" && source.defaultLabel.trim()
    ? source.defaultLabel.trim().slice(0, 64)
    : DEFAULT_SETTINGS.defaultLabel;
  const preferredFacingMode = source.preferredFacingMode === "user" ? "user" : "environment";
  const videoPreset = ["720p", "1080p", "1440p"].includes(source.videoPreset) ? source.videoPreset : DEFAULT_SETTINGS.videoPreset;

  return {
    defaultLabel,
    preferredFacingMode,
    videoPreset,
    startMuted: Boolean(source.startMuted),
    autoStart: Boolean(source.autoStart),
    cleanViewer: source.cleanViewer === undefined ? DEFAULT_SETTINGS.cleanViewer : Boolean(source.cleanViewer),
  };
}

// Crée le dossier de configuration si besoin.
function ensureConfigDir() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Charge la configuration persistée ou rétablit les valeurs par défaut.
function loadSettings() {
  ensureConfigDir();

  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaults = normalizeSettings(DEFAULT_SETTINGS);
    fs.writeFileSync(SETTINGS_FILE, `${JSON.stringify(defaults, null, 2)}\n`);
    return defaults;
  }

  try {
    const raw = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    return normalizeSettings(raw);
  } catch (error) {
    console.warn("[config] Invalid settings file, using defaults:", error.message);
    return normalizeSettings(DEFAULT_SETTINGS);
  }
}

// Enregistre la configuration normalisée sur le disque.
function saveSettings(nextSettings) {
  const normalized = normalizeSettings(nextSettings);
  ensureConfigDir();
  fs.writeFileSync(SETTINGS_FILE, `${JSON.stringify(normalized, null, 2)}\n`);
  settings = normalized;
  return settings;
}

// Lit un fichier et laisse remonter les erreurs si la lecture échoue.
function readFileSafe(filePath) {
  return fs.readFileSync(filePath);
}

// Récupère les adresses IPv4 locales exploitables sur le réseau.
function getLocalAddresses() {
  const seen = new Set();
  const addresses = [];

  for (const network of Object.values(os.networkInterfaces())) {
    for (const item of network || []) {
      if (!item || item.family !== "IPv4" || item.internal) {
        continue;
      }

      const ip = item.address;
      if (seen.has(ip)) {
        continue;
      }

      seen.add(ip);
      addresses.push(ip);
    }
  }

  if (!addresses.length) {
    addresses.push("127.0.0.1");
  }

  return addresses;
}

// Construit l'origine HTTP ou HTTPS à partir de la requête reçue.
function getRequestOrigin(req, secure) {
  const host = req.headers.host || (secure ? `localhost:${HTTPS_PORT}` : `localhost:${HTTP_PORT}`);
  return `${secure ? "https" : "http"}://${host}`;
}

// Prépare les URLs utiles pour le tableau de bord et le téléphone.
function getUrls(req) {
  const lanAddresses = getLocalAddresses();
  return {
    dashboardLocal: `http://localhost:${HTTP_PORT}`,
    dashboardLoopback: `http://127.0.0.1:${HTTP_PORT}`,
    configLocal: `http://localhost:${HTTP_PORT}/config`,
    configLoopback: `http://127.0.0.1:${HTTP_PORT}/config`,
    configLauncher: `http://localhost:${HTTP_PORT}/downloads/open-config.cmd`,
    certDownload: `http://localhost:${HTTP_PORT}/downloads/local.cer`,
    phoneUrls: lanAddresses.map((ip) => `https://${ip}:${HTTPS_PORT}/phone`),
    viewUrls: lanAddresses.map((ip) => `http://${ip}:${HTTP_PORT}/view/SESSION_ID?clean=1`),
    lanAddresses,
  };
}

// Crée une nouvelle session de diffusion avec ses files de messages.
function makeSession(label = settings.defaultLabel || "Phone") {
  const id = randomUUID().split("-")[0].toUpperCase();
  const now = Date.now();
  const session = {
    id,
    label,
    createdAt: now,
    updatedAt: now,
    state: "idle",
    deviceType: "unknown",
    facingMode: "environment",
    hasAudio: true,
    hasVideo: true,
    publisherSeenAt: 0,
    viewerSeenAt: 0,
    publisherState: "idle",
    viewerState: "idle",
    queues: {
      publisher: [],
      viewer: [],
    },
    seq: {
      publisher: 1,
      viewer: 1,
    },
  };

  sessions.set(id, session);
  return session;
}

// Récupère une session ou renvoie une erreur explicite si elle manque.
function getSessionOrThrow(id) {
  const session = sessions.get(id);
  if (!session) {
    const error = new Error("Session not found");
    error.statusCode = 404;
    throw error;
  }
  return session;
}

// Convertit la session interne en objet exposable par l'API.
function toPublicSession(session) {
  const now = Date.now();
  const publisherOnline = now - session.publisherSeenAt < HEARTBEAT_TTL_MS;
  const viewerOnline = now - session.viewerSeenAt < HEARTBEAT_TTL_MS;
  return {
    id: session.id,
    label: session.label,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    state: session.state,
    deviceType: session.deviceType,
    facingMode: session.facingMode,
    hasAudio: session.hasAudio,
    hasVideo: session.hasVideo,
    publisherOnline,
    viewerOnline,
    publisherSeenAt: session.publisherSeenAt || null,
    viewerSeenAt: session.viewerSeenAt || null,
    queueDepth: {
      publisher: session.queues.publisher.length,
      viewer: session.queues.viewer.length,
    },
  };
}

// Limite la taille d'une file de messages pour éviter l'emballement.
function trimQueue(queue) {
  if (queue.length > MESSAGE_LIMIT) {
    queue.splice(0, queue.length - MESSAGE_LIMIT);
  }
}

// Route un message vers le bon rôle et met à jour l'horodatage associé.
function routeMessage(session, from, kind, payload) {
  const target = from === "publisher" ? "viewer" : "publisher";
  const now = Date.now();
  const message = {
    seq: session.seq[target]++,
    from,
    kind,
    payload,
    at: now,
  };

  session.queues[target].push(message);
  trimQueue(session.queues[target]);

  if (kind === "state" && from === "publisher" && payload && typeof payload === "object") {
    if (typeof payload.label === "string" && payload.label.trim()) {
      session.label = payload.label.trim().slice(0, 64);
    }
    if (typeof payload.state === "string") {
      session.state = payload.state;
      session.publisherState = payload.state;
    }
    if (typeof payload.facingMode === "string") {
      session.facingMode = payload.facingMode;
    }
    if (typeof payload.deviceType === "string") {
      session.deviceType = payload.deviceType;
    }
    if (typeof payload.hasAudio === "boolean") {
      session.hasAudio = payload.hasAudio;
    }
    if (typeof payload.hasVideo === "boolean") {
      session.hasVideo = payload.hasVideo;
    }
  }

  session.updatedAt = now;
  return message;
}

// Lit le corps JSON d'une requête de manière sécurisée.
function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
      if (chunks.reduce((sum, part) => sum + part.length, 0) > 1_000_000) {
        reject(Object.assign(new Error("Payload too large"), { statusCode: 413 }));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolve(null);
        return;
      }

      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : null);
      } catch (error) {
        reject(Object.assign(new Error("Invalid JSON"), { statusCode: 400, cause: error }));
      }
    });
    req.on("error", reject);
  });
}

// Répond avec du JSON joliment formaté.
function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

// Répond avec du texte brut et des en-têtes personnalisables.
function sendText(res, statusCode, text, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(text);
}

// Répond avec un SVG inline prêt à être affiché par le navigateur.
function sendSvg(res, statusCode, svg) {
  res.writeHead(statusCode, {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(svg);
}

// Sert un fichier statique en ajoutant les en-têtes de cache adaptés.
function sendFile(res, filePath, contentType, secure) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  fs.createReadStream(filePath).pipe(res);
}

// Déduit le type MIME à partir de l'extension du fichier.
function contentTypeFor(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".cer":
      return "application/pkix-cert";
    default:
      return "application/octet-stream";
  }
}

// Sert un fichier du dossier public en neutralisant les chemins douteux.
function servePublicFile(res, relativePath) {
  const normalized = path.normalize(relativePath).replace(/^([.][.][/\\])+/, "");
  const fullPath = path.join(PUBLIC_DIR, normalized);
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    sendText(res, 403, "Forbidden");
    return;
  }
  sendFile(res, fullPath, contentTypeFor(fullPath));
}

// Redirige vers HTTPS quand la requête arrive sur le port en clair.
function redirectToHttps(req, res) {
  const hostHeader = req.headers.host || `localhost:${HTTP_PORT}`;
  const hostname = hostHeader.split(":")[0];
  const location = `https://${hostname}:${HTTPS_PORT}${req.url}`;
  res.writeHead(302, {
    Location: location,
    "Cache-Control": "no-store",
  });
  res.end();
}

// Indique si la requête a été reçue sur la pile HTTPS.
function isHttpsServer(req) {
  return Boolean(req.socket.encrypted);
}

// Traite les routes HTTP de l'application locale.
function handleRequest(req, res) {
  const url = new URL(req.url, "http://localhost");
  const secure = isHttpsServer(req);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/downloads/local.cer") {
    sendFile(res, path.join(CERT_DIR, "local.cer"), "application/pkix-cert");
    return;
  }

  if (pathname === "/downloads/open-config.cmd") {
    sendFile(res, path.join(ROOT, "open-config.cmd"), "text/plain; charset=utf-8");
    return;
  }

  if (pathname === "/api/bootstrap" && req.method === "GET") {
    sendJson(res, 200, {
      secure,
      urls: getUrls(req),
      settings,
    });
    return;
  }

  if (pathname === "/api/settings" && req.method === "GET") {
    sendJson(res, 200, { settings });
    return;
  }

  if (pathname === "/api/settings" && req.method === "POST") {
    parseBody(req)
      .then((body) => {
        const next = body && typeof body === "object" ? body : {};
        sendJson(res, 200, { settings: saveSettings({ ...settings, ...next }) });
      })
      .catch((error) => handleError(res, error));
    return;
  }

  if (pathname === "/api/qr" && req.method === "GET") {
    const text = (url.searchParams.get("text") || "").trim();
    const size = Number(url.searchParams.get("size") || 240);

    if (!text) {
      sendJson(res, 400, { error: "Missing text query parameter" });
      return;
    }

    QRCode.toString(text, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      width: Number.isFinite(size) ? Math.min(Math.max(size, 128), 600) : 240,
    })
      .then((svg) => sendSvg(res, 200, svg))
      .catch((error) => handleError(res, error));
    return;
  }

  if (pathname === "/api/sessions" && req.method === "GET") {
    sendJson(res, 200, {
      items: Array.from(sessions.values())
        .map(toPublicSession)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    });
    return;
  }

  if (pathname === "/api/sessions" && req.method === "POST") {
    parseBody(req)
      .then((body) => {
        const label = typeof body?.label === "string" && body.label.trim() ? body.label.trim() : "Phone";
        const deviceType = typeof body?.deviceType === "string" ? body.deviceType : "unknown";
        const session = makeSession(label);
        session.deviceType = deviceType;
        session.state = "waiting";
        session.updatedAt = Date.now();
        sendJson(res, 201, { session: toPublicSession(session) });
      })
      .catch((error) => handleError(res, error));
    return;
  }

  const sessionMatch = pathname.match(/^\/api\/sessions\/([^/]+)(?:\/(messages|state))?$/);
  if (sessionMatch) {
    const sessionId = sessionMatch[1];
    const action = sessionMatch[2];
    let session;
    try {
      session = getSessionOrThrow(sessionId);
    } catch (error) {
      handleError(res, error);
      return;
    }

    if (!action && req.method === "GET") {
      sendJson(res, 200, { session: toPublicSession(session) });
      return;
    }

    if (action === "state" && req.method === "POST") {
      parseBody(req)
        .then((body) => {
          const role = body?.role === "viewer" ? "viewer" : "publisher";
          const now = Date.now();
          if (role === "publisher") {
            session.publisherSeenAt = now;
            if (typeof body?.status === "string") {
              session.state = body.status;
              session.publisherState = body.status;
            }
            if (typeof body?.label === "string" && body.label.trim()) {
              session.label = body.label.trim().slice(0, 64);
            }
            if (typeof body?.facingMode === "string") {
              session.facingMode = body.facingMode;
            }
            if (typeof body?.deviceType === "string") {
              session.deviceType = body.deviceType;
            }
            if (typeof body?.hasAudio === "boolean") {
              session.hasAudio = body.hasAudio;
            }
            if (typeof body?.hasVideo === "boolean") {
              session.hasVideo = body.hasVideo;
            }
          } else {
            session.viewerSeenAt = now;
            if (typeof body?.status === "string") {
              session.viewerState = body.status;
            }
          }
          session.updatedAt = now;
          sendJson(res, 200, { session: toPublicSession(session) });
        })
        .catch((error) => handleError(res, error));
      return;
    }

    if (action === "messages" && req.method === "POST") {
      parseBody(req)
        .then((body) => {
          const from = body?.from === "viewer" ? "viewer" : "publisher";
          const messages = Array.isArray(body?.messages) ? body.messages : [body];
          const accepted = [];
          for (const item of messages) {
            if (!item || typeof item !== "object") {
              continue;
            }
            const kind = typeof item.kind === "string" ? item.kind : "message";
            const payload = Object.prototype.hasOwnProperty.call(item, "payload") ? item.payload : item;
            accepted.push(routeMessage(session, from, kind, payload));
          }
          session.updatedAt = Date.now();
          sendJson(res, 200, { accepted });
        })
        .catch((error) => handleError(res, error));
      return;
    }

    if (action === "messages" && req.method === "GET") {
      const role = url.searchParams.get("role") === "publisher" ? "publisher" : "viewer";
      const after = Number(url.searchParams.get("after") || 0);
      const items = session.queues[role].filter((message) => message.seq > after);
      sendJson(res, 200, {
        items,
        latestSeq: items.length ? items[items.length - 1].seq : after,
      });
      return;
    }

    if (action === "messages" && req.method === "DELETE") {
      const role = url.searchParams.get("role") === "publisher" ? "publisher" : "viewer";
      session.queues[role] = [];
      sendJson(res, 200, { ok: true });
      return;
    }
  }

  if (pathname === "/" || pathname === "/dashboard") {
    servePublicFile(res, "dashboard.html");
    return;
  }

  if (pathname === "/config") {
    servePublicFile(res, "config.html");
    return;
  }

  if (pathname === "/phone") {
    if (!secure) {
      redirectToHttps(req, res);
      return;
    }
    servePublicFile(res, "phone.html");
    return;
  }

  if (pathname === "/view" || pathname.startsWith("/view/")) {
    servePublicFile(res, "view.html");
    return;
  }

  if (pathname === "/styles.css") {
    servePublicFile(res, "styles.css");
    return;
  }

  if (pathname === "/shared.js") {
    servePublicFile(res, "shared.js");
    return;
  }

  if (pathname === "/dashboard.js") {
    servePublicFile(res, "dashboard.js");
    return;
  }

  if (pathname === "/config.js") {
    servePublicFile(res, "config.js");
    return;
  }

  if (pathname === "/phone.js") {
    servePublicFile(res, "phone.js");
    return;
  }

  if (pathname === "/view.js") {
    servePublicFile(res, "view.js");
    return;
  }

  if (pathname.startsWith("/public/")) {
    servePublicFile(res, pathname.slice("/public/".length));
    return;
  }

  sendText(res, 404, "Not found");
}

// Transforme une erreur en réponse HTTP lisible.
function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : error.message || "Request failed";
  if (statusCode >= 500) {
    console.error(error);
  }
  sendJson(res, statusCode, { error: message });
}

// Démarre les serveurs HTTP et HTTPS utilisés par l'application.
function startServers() {
  ensureCertificate();

  const httpsServer = https.createServer(
    {
      pfx: readFileSafe(CERT_PFX),
      passphrase: CERT_PASSWORD,
    },
    handleRequest
  );

  const httpServer = http.createServer(handleRequest);

  httpsServer.listen(HTTPS_PORT, HOST, () => {
    console.log(`HTTPS server ready on https://localhost:${HTTPS_PORT}`);
  });

  httpServer.listen(HTTP_PORT, HOST, () => {
    console.log(`HTTP server ready on http://localhost:${HTTP_PORT}`);
  });

  const urls = getUrls({ headers: { host: `localhost:${HTTP_PORT}` } });
  console.log("");
  console.log("Open the dashboard on this PC:");
  console.log(`  ${urls.dashboardLocal}`);
  console.log("Open the configuration page on this PC:");
  console.log(`  ${urls.configLocal}`);
  console.log("");
  console.log("Open the phone page on each mobile device:");
  for (const url of urls.phoneUrls) {
    console.log(`  ${url}`);
  }
  console.log("");
  console.log("Download the certificate file for trust setup:");
  console.log(`  ${urls.certDownload}`);
  console.log("");
  console.log("OBS browser source example:");
  console.log(`  http://localhost:${HTTP_PORT}/view/SESSION_ID?clean=1`);
}

startServers();
