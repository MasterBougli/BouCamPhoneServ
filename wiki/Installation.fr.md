# Installation

[EN](Installation.md) | [FR](Installation.fr.md) | [ES](Installation.es.md)

## Pré-requis

- Windows pour la version actuelle
- Node.js 20 ou plus récent
- un navigateur moderne sur le téléphone

## Installer et lancer

```bash
npm install
npm start
```

## Certificat local

Le tableau de bord fournit le certificat public `.cer` facultatif (également
appelé `.crt` sur certaines plateformes). HTTPS est obligatoire pour la caméra
et le micro, mais l’installation du certificat ne l’est pas : tu peux accepter
manuellement l’avertissement du navigateur lorsque c’est possible. Son
installation sert uniquement à éviter l’avertissement HTTPS non reconnu/non sécurisé récurrent.

## Ce qu’il faut ouvrir

- Tableau de bord : `http://localhost:8080`
- Page téléphone : `https://<adresse-ip-du-pc>:8443/phone`

## Soutien

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)
