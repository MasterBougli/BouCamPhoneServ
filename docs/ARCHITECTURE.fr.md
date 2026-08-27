# Architecture technique

[EN](ARCHITECTURE.md) | [FR](ARCHITECTURE.fr.md) | [ES](ARCHITECTURE.es.md)

Page wiki: [Accueil](../wiki/Home.fr.md)

## Vue d’ensemble

BouCamPhoneServ sépare le projet en trois couches :

- le téléphone
- le serveur local
- la sortie OBS

## Flux des données

```mermaid
flowchart LR
  Phone["Téléphone dans le navigateur"]
  Server["Serveur local"]
  Dashboard["Tableau de bord"]
  Mosaic["Mosaïque de caméras"]
  OBS["OBS Browser Source"]

  Phone -->|"caméra + micro + signalisation"| Server
  Dashboard -->|"contrôle local"| Server
  Mosaic -->|"un viewer isolé par caméra"| Server
  OBS -->|"affichage séparé"| Server
```

## Rôle de chaque partie

### Téléphone

- ouvre une page web
- demande l’accès caméra et micro
- envoie le flux vidéo et audio
- peut changer de caméra ou couper le micro

### Serveur local

- sert les pages HTML
- gère les sessions
- transmet les messages entre téléphone et vue OBS
- route chaque offre WebRTC et candidat ICE avec un `viewerId` unique, ce qui permet à OBS et à la mosaïque de regarder simultanément
- fournit le certificat local facultatif
- lance l’icône de notification Windows et lui permet d’arrêter proprement le processus serveur

### Tableau de bord

- affiche les téléphones actifs
- montre les QR codes
- permet de copier les liens
- permet d’envoyer des commandes simples

### Source OBS

- récupère la vidéo de la session choisie
- affiche chaque téléphone comme une source indépendante

### Mosaïque de caméras

- crée un viewer WebRTC isolé pour chaque téléphone actif
- démarre chaque tuile sans son pour garantir la lecture automatique du navigateur
- reconnecte les tuiles indépendamment sans interrompre OBS

## Pourquoi ce choix

Cette approche garde :

- une installation minimale
- une compatibilité navigateur large
- une intégration propre avec OBS
- une base facile à faire évoluer plus tard vers Linux ou Raspberry Pi

## Soutenir le projet

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licence et contributions

BouCamPhoneServ est sous licence `AGPL-3.0-only`.
Les contributions doivent être signées avec `Signed-off-by:` pour respecter la DCO 1.1.

English version: [ARCHITECTURE.md](ARCHITECTURE.md)
