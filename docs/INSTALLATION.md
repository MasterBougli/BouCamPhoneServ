# Installation et certificat

## Pré-requis

- Windows pour la version actuelle
- Node.js 20 ou plus récent
- un navigateur moderne sur le téléphone

## Installation du projet

Dans le dossier du projet :

```bash
npm install
```

## Lancer l’application

```bash
npm start
```

## Certificat local

BouCamPhoneServ sert la page téléphone en HTTPS, parce que les navigateurs demandent un contexte sécurisé pour la caméra et le micro.

Au premier lancement, un certificat local est généré automatiquement dans `certs/`.

Le certificat public à installer sur les téléphones est disponible depuis :

- le tableau de bord
- ou `http://localhost:8080/downloads/local.cer`

## Installation sur le téléphone

1. ouvre le lien du certificat
2. télécharge le fichier
3. installe-le comme certificat de confiance
4. ouvre ensuite la page téléphone

## Adresse réseau

Le tableau de bord affiche les adresses LAN détectées par le PC.

Utilise celle qui correspond à ton réseau local actuel.

## Remarques

- pas besoin d’installer une application sur le téléphone
- pas besoin d’un compte en ligne
- tout reste sur le réseau local
