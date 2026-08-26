# Cam From Phone

Cam From Phone est une base locale pour utiliser la caméra et le micro de plusieurs téléphones dans OBS, sans rien installer sur les mobiles.

Le projet est pensé pour :

- le réseau local
- iPhone et Android
- jusqu’à plusieurs téléphones en même temps
- des sources OBS séparées par téléphone
- une interface propre dès le départ

## Ce que contient cette version

- une page téléphone à ouvrir dans le navigateur
- un tableau de bord local pour le PC
- un QR code pour ouvrir rapidement la page téléphone
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
4. accepte la caméra et le micro
5. ajoute la source OBS dans `View` avec l’URL affichée pour chaque session

## Documentation

- [Tutoriel complet](docs/TUTORIEL.md)
- [Installation et certificat](docs/INSTALLATION.md)
- [Configuration OBS](docs/OBS.md)
- [Architecture technique](docs/ARCHITECTURE.md)
- [Dépannage](docs/DEPANNAGE.md)
- [Contribuer au projet](CONTRIBUTING.md)
- [Journal des versions](CHANGELOG.md)

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

Version actuelle du projet : `0.1.1`

## Licence

MIT
