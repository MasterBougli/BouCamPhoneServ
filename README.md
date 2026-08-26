# BouCamPhoneServ

[EN](README.md) | [FR](README.fr.md) | [ES](README.es.md)

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
- a QR code for quick access to the phone page
- separate OBS links for each device
- simple controls to rename, mute, switch camera, and stop a source
- a local certificate generated on first launch

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
2. download the public certificate from the dashboard
3. open the phone page from the link or QR code
4. allow camera and microphone access
5. add the OBS source in `View` with the URL shown for each session

## Documentation

- [Full tutorial](docs/TUTORIAL.md), [FR](docs/TUTORIAL.fr.md), [ES](docs/TUTORIAL.es.md)
- [Installation and certificate](docs/INSTALLATION.md), [FR](docs/INSTALLATION.fr.md), [ES](docs/INSTALLATION.es.md)
- [OBS setup](docs/OBS.md), [FR](docs/OBS.fr.md), [ES](docs/OBS.es.md)
- [Technical architecture](docs/ARCHITECTURE.md), [FR](docs/ARCHITECTURE.fr.md), [ES](docs/ARCHITECTURE.es.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md), [FR](docs/TROUBLESHOOTING.fr.md), [ES](docs/TROUBLESHOOTING.es.md)
- [Development notes](docs/DEVELOPMENT.md), [FR](docs/DEVELOPMENT.fr.md), [ES](docs/DEVELOPMENT.es.md)
- [Contributing](CONTRIBUTING.md), [FR](CONTRIBUTING.fr.md), [ES](CONTRIBUTING.es.md)
- [Changelog](changelog.md), [FR](CHANGELOG.fr.md), [ES](CHANGELOG.es.md)

## Important Files

- [server.js](server.js)
- [public/dashboard.html](public/dashboard.html)
- [public/dashboard.js](public/dashboard.js)
- [public/phone.html](public/phone.html)
- [public/phone.js](public/phone.js)
- [public/view.html](public/view.html)
- [public/view.js](public/view.js)
- [scripts/create-local-cert.ps1](scripts/create-local-cert.ps1)

## Version

Current project version: `0.1.7`

- Release notes: [changelog.md](changelog.md)

## Support the Project

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## License

AGPL-3.0-only
