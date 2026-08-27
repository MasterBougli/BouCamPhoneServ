# Installation et certificat

[EN](INSTALLATION.md) | [FR](INSTALLATION.fr.md) | [ES](INSTALLATION.es.md)

Page wiki: [Accueil](../wiki/Home.fr.md)

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

L’installation de ce certificat public est facultative. HTTPS reste obligatoire
pour accéder à la caméra et au micro, mais tu peux continuer en acceptant
manuellement l’avertissement du navigateur lorsque l’appareil le permet.
Installer le fichier `.cer` (également appelé `.crt` sur certaines plateformes)
sert uniquement à éviter l’avertissement HTTPS non reconnu/non sécurisé récurrent.

Le certificat public facultatif est disponible depuis :

- le tableau de bord
- ou `http://localhost:8080/downloads/local.cer`

## Installation facultative sur le téléphone

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

## Soutenir le projet

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licence et contributions

BouCamPhoneServ est sous licence `AGPL-3.0-only`.
Les contributions doivent être signées avec `Signed-off-by:` pour respecter la DCO 1.1.

English version: [INSTALLATION.md](INSTALLATION.md)
