# Développement

## Lancer en local

```bash
npm start
```

## Fichiers principaux

- `server.js` pour le serveur et la signalisation
- `public/dashboard.js` pour le tableau de bord
- `public/phone.js` pour la page téléphone
- `public/view.js` pour la source OBS

## Génération du certificat

Le script PowerShell situé dans `scripts/create-local-cert.ps1` crée :

- `certs/local.pfx`
- `certs/local.cer`

## Points d’attention

- garder le projet sans installation côté téléphone
- conserver la compatibilité réseau local
- éviter de lier le fonctionnement à un service externe

## Soutenir le projet

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licence et contributions

BouCamPhoneServ est sous licence `AGPL-3.0-only`.
Les contributions doivent être signées avec `Signed-off-by:` pour respecter la DCO 1.1.

English version: [DEVELOPMENT.md](DEVELOPMENT.md)
