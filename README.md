# BouCamPhoneServ

[EN](README.md) | [FR](README.fr.md) | [ES](README.es.md)

![Version](https://img.shields.io/badge/version-0.1.19-blue)
![License](https://img.shields.io/badge/license-AGPL--3.0--only-green)
![Docs](https://img.shields.io/badge/docs-EN%2FFR%2FES-orange)
![Wiki](https://img.shields.io/badge/wiki-ready-purple)

BouCamPhoneServ is a local-first bridge for using the camera and microphone from one or more phones inside OBS without installing anything on the phones.

This project is licensed under `AGPL-3.0-only` and contributions are handled under DCO 1.1.

The project is designed for:

- local network use
- iPhone and Android
- multiple phones at the same time
- separate OBS sources per phone
- a polished interface from day one

## What this release includes

- a phone page opened in the browser
- a local dashboard for the PC
- a live camera mosaic available at `http://localhost:8080/mosaic`
- multi-viewer signaling so the mosaic and OBS can watch the same phone simultaneously
- a Windows notification-area icon with dashboard, mosaic, configuration, and safe shutdown actions
- a graphical configuration page for shared server settings
- a Windows launcher and `npm run config` shortcut for the configuration page
- a sectioned configuration layout for network, camera, audio, startup, and shortcuts
- a studio-style sidebar with quick navigation and shortcut cards
- a QR code for quick access to the phone page
- separate OBS links for each device
- simple controls to rename, mute, switch camera, and stop a source
- an optional local certificate generated on first launch to avoid the browser's untrusted HTTPS warning

## Quick Start

```bash
npm install
```

Then:

```bash
npm start
```

After that:

1. open `http://localhost:8080` on the PC
2. open the configuration page if you want to adjust the defaults, or run `npm run config` / `open-config.cmd`
3. optionally install the public `.cer`/`.crt` certificate to avoid the HTTPS security warning, or accept the warning manually if your browser allows it
4. open the phone page from the link or QR code
5. allow camera and microphone access
6. add the OBS source in `View` with the URL shown for each session
7. open `http://localhost:8080/mosaic` to monitor every active camera together

On Windows, the server also appears in the notification area near the clock. Double-click its icon to open the dashboard, or right-click it to open the mosaic, configuration, or stop the server.

## Documentation

- [Wiki tutorial](wiki/Tutorial.md), [FR](wiki/Tutorial.fr.md), [ES](wiki/Tutorial.es.md)
- [Wiki installation](wiki/Installation.md), [FR](wiki/Installation.fr.md), [ES](wiki/Installation.es.md)
- [Wiki usage](wiki/Usage.md), [FR](wiki/Usage.fr.md), [ES](wiki/Usage.es.md)
- [Technical architecture](docs/ARCHITECTURE.md), [FR](docs/ARCHITECTURE.fr.md), [ES](docs/ARCHITECTURE.es.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md), [FR](docs/TROUBLESHOOTING.fr.md), [ES](docs/TROUBLESHOOTING.es.md)
- [Development notes](docs/DEVELOPMENT.md), [FR](docs/DEVELOPMENT.fr.md), [ES](docs/DEVELOPMENT.es.md)
- [Contributing](CONTRIBUTING.md), [FR](CONTRIBUTING.fr.md), [ES](CONTRIBUTING.es.md)
- [Changelog](changelog.md), [FR](CHANGELOG.fr.md), [ES](CHANGELOG.es.md)
- [Wiki home](wiki/Home.md), [FR](wiki/Home.fr.md), [ES](wiki/Home.es.md)

## Important Files

- [server.js](server.js)
- [config/settings.json](config/settings.json)
- [public/dashboard.html](public/dashboard.html)
- [public/dashboard.js](public/dashboard.js)
- [public/config.html](public/config.html)
- [public/config.js](public/config.js)
- [public/mosaic.html](public/mosaic.html)
- [public/mosaic.js](public/mosaic.js)
- [scripts/server-tray.ps1](scripts/server-tray.ps1)
- [open-config.cmd](open-config.cmd)
- [scripts/open-config.ps1](scripts/open-config.ps1)
- [public/phone.html](public/phone.html)
- [public/phone.js](public/phone.js)
- [public/view.html](public/view.html)
- [public/view.js](public/view.js)
- [scripts/create-local-cert.ps1](scripts/create-local-cert.ps1)

## Version

Current project version: `0.1.19`

- Release notes: [changelog.md](changelog.md)

## Support the Project

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## License

AGPL-3.0-only, see [LICENSE](LICENSE) and [NOTICE](NOTICE.md)
