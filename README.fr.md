# BouCamPhoneServ

[EN](README.md) | [FR](README.fr.md) | [ES](README.es.md)

![Version](https://img.shields.io/badge/version-0.1.8-blue)
![License](https://img.shields.io/badge/license-AGPL--3.0--only-green)
![Docs](https://img.shields.io/badge/docs-EN%2FFR%2FES-orange)

BouCamPhoneServ est une passerelle locale permettant d’utiliser la caméra et le micro d’un ou plusieurs téléphones dans OBS sans rien installer sur les mobiles.

Ce projet est sous licence `AGPL-3.0-only` et les contributions suivent la DCO 1.1.

Le projet est pensé pour :

- le réseau local
- iPhone et Android
- plusieurs téléphones en même temps
- des sources OBS séparées par téléphone
- une interface soignée dès le départ

## Ce que contient cette version

- une page téléphone à ouvrir dans le navigateur
- un tableau de bord local pour le PC
- un QR code pour accéder rapidement à la page téléphone
- des liens OBS séparés pour chaque appareil
- des commandes simples pour renommer, couper le micro, changer la caméra et arrêter une source
- un certificat local généré au premier lancement

## Démarrage rapide

```bash
npm install
```

Puis :

```bash
npm start
```

Ensuite :

1. ouvre `http://localhost:8080` sur le PC
2. télécharge le certificat public depuis le tableau de bord
3. ouvre la page téléphone depuis le lien ou le QR code
4. autorise la caméra et le micro
5. ajoute la source OBS dans `View` avec l’URL affichée pour chaque session

## Documentation

- [Tutoriel complet](docs/TUTORIAL.fr.md), [EN](docs/TUTORIAL.md), [ES](docs/TUTORIAL.es.md)
- [Installation et certificat](docs/INSTALLATION.fr.md), [EN](docs/INSTALLATION.md), [ES](docs/INSTALLATION.es.md)
- [Configuration OBS](docs/OBS.fr.md), [EN](docs/OBS.md), [ES](docs/OBS.es.md)
- [Architecture technique](docs/ARCHITECTURE.fr.md), [EN](docs/ARCHITECTURE.md), [ES](docs/ARCHITECTURE.es.md)
- [Dépannage](docs/TROUBLESHOOTING.fr.md), [EN](docs/TROUBLESHOOTING.md), [ES](docs/TROUBLESHOOTING.es.md)
- [Notes de développement](docs/DEVELOPMENT.fr.md), [EN](docs/DEVELOPMENT.md), [ES](docs/DEVELOPMENT.es.md)
- [Contribuer au projet](CONTRIBUTING.fr.md), [EN](CONTRIBUTING.md), [ES](CONTRIBUTING.es.md)
- [Journal des versions](CHANGELOG.fr.md), [EN](changelog.md), [ES](CHANGELOG.es.md)

## Fichiers importants

- [server.js](server.js)
- [public/dashboard.html](public/dashboard.html)
- [public/dashboard.js](public/dashboard.js)
- [public/phone.html](public/phone.html)
- [public/phone.js](public/phone.js)
- [public/view.html](public/view.html)
- [public/view.js](public/view.js)
- [scripts/create-local-cert.ps1](scripts/create-local-cert.ps1)

## Version

Version actuelle du projet : `0.1.8`

- Notes de version : [changelog.md](changelog.md)

## Soutenir le projet

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licence

AGPL-3.0-only, voir [LICENSE](LICENSE)
