# Journal des versions

[EN](changelog.md) | [FR](CHANGELOG.fr.md) | [ES](CHANGELOG.es.md)

## Résumé

Ce journal garde la version la plus récente en haut pour retrouver rapidement les changements les plus importants.

## 0.1.20 - 2026-08-27

- refonte de l’en-tête de configuration pour reprendre la présentation compacte du tableau de bord
- passage plus précoce de la configuration sur une seule colonne aux largeurs intermédiaires
- correction des badges, URL, boutons et descriptions longues qui sortaient de leurs cartes
- renforcement du confinement responsive sur le tableau de bord, la mosaïque, le téléphone, la configuration et la vue OBS
- ajout de la mosaïque dans les raccourcis de configuration
- mise à jour de la version du projet à `0.1.20`

## 0.1.19 - 2026-08-27

- placement des sessions et de l’état du serveur avant les cartes d’aide sur le tableau de bord
- affichage progressif de la connexion téléphone, de l’aide au certificat et de la configuration
- ajout d’une mosaïque vidéo responsive sur `/mosaic`
- ajout d’une signalisation WebRTC multi-viewer pour recevoir le même téléphone dans OBS et la mosaïque simultanément
- ajout d’une icône Windows dans la zone de notification avec raccourcis et arrêt confirmé du serveur
- placement du formulaire de configuration avant sa barre de navigation sur mobile
- mise à jour de la version du projet à `0.1.19`

## 0.1.18 - 2026-08-27

- précision dans toute la documentation que l’installation du certificat local `.cer`/`.crt` est facultative
- explication que HTTPS reste obligatoire, tandis que le certificat sert uniquement à éviter l’avertissement récurrent non reconnu/non sécurisé du navigateur
- documentation de l’acceptation manuelle de l’avertissement HTTPS lorsque le navigateur et l’appareil le permettent
- mise à jour de la version du projet à `0.1.18`

## 0.1.17 - 2026-08-27

- refonte complète de toutes les interfaces avec un design system de régie OLED généré avec UI UX Pro Max
- ajout d’une mise en page Bento adaptative, d’une typographie orientée production, de couleurs sémantiques et d’icônes SVG cohérentes
- amélioration du focus clavier, des cibles tactiles, du zoom mobile, de la sémantique des formulaires et de la réduction des animations
- mise à jour de la version du projet à `0.1.17`

## 0.1.16 - 2026-08-26

- transformation de l’écran de configuration en une mise en page style studio avec barre latérale, navigation par sections et cartes de raccourcis
- ajout d’une hiérarchie visuelle plus forte et de repères de type icône dans les contrôles de configuration
- mise à jour de la version du projet à `0.1.16`

## 0.1.15 - 2026-08-26

- refonte de la page de configuration en sections plus lisibles pour le réseau, la caméra, l’audio, le démarrage et les raccourcis
- ajout des téléchargements du lanceur et des raccourcis de commande directement dans l’écran de configuration
- mise à jour de la version du projet à `0.1.15`

## 0.1.14 - 2026-08-26

- ajout d’un lanceur Windows en un clic et d’un raccourci `npm run config` pour la page de configuration
- application immédiate des réglages sur la page de configuration avec un retour plus clair
- conservation du comportement de démarrage automatique via les réglages partagés du serveur
- mise à jour de la version du projet à `0.1.14`

## 0.1.13 - 2026-08-26

- ajout d’une page de configuration graphique reliée aux réglages partagés du serveur
- liaison du tableau de bord avec l’écran de configuration et affichage des réglages actifs
- mise à jour de la version du projet à `0.1.13`

## 0.1.12 - 2026-08-26

- ajout de commentaires en français sur les principales fonctions du code
- mise à jour de la version du projet à `0.1.12`

## 0.1.11 - 2026-08-26

- suppression des anciens fichiers `docs/TUTORIAL.*` pour faire du dossier wiki l’unique source du tutoriel
- ajout de liens vers le wiki dans les autres guides pour une navigation plus pratique
- mise à jour de la version du projet à `0.1.11`

## 0.1.10 - 2026-08-26

- déplacement du contenu du tutoriel dans le dossier `wiki/` sous forme de pages Markdown dédiées
- liaison des sections tutoriel et installation du README vers les pages wiki
- mise à jour de la version du projet à `0.1.10`

## 0.1.9 - 2026-08-26

- ajout de badges et d’une section wiki dans les README
- ajout d’un petit ensemble NOTICE pour expliquer la licence et le flux DCO
- ajout de pages wiki prêtes à l’emploi pour l’installation et l’utilisation en EN, FR et ES
- mise à jour de la version du projet à `0.1.9`

## 0.1.8 - 2026-08-26

- ajout des badges finaux dans les README pour une page d’accueil plus propre
- ajout d’un fichier de licence AGPLv3 complet
- journal des versions remis en forme avec un résumé plus clair
- mise à jour de la version du projet à `0.1.8`

## 0.1.7 - 2026-08-26

- renommer le journal principal en `changelog.md`
- ajouter une section Version plus visible dans le README
- mettre à jour les métadonnées du package à `0.1.7`

## 0.1.6 - 2026-08-26

- ajout des versions espagnoles pour les autres fichiers Markdown
- ajout des liens EN/FR/ES complets en haut de la documentation
- mise à jour des métadonnées du package à `0.1.6`

## 0.1.5 - 2026-08-26

- ajout d’un README espagnol en plus des versions anglaise et française
- ajout de liens de langue en haut des fichiers README
- mise à jour des métadonnées du package à `0.1.5`

## 0.1.4 - 2026-08-26

- ajout du lien de donation dans la documentation Markdown
- passage de la notice de licence du projet à AGPLv3 plus DCO
- mise à jour des métadonnées du package à `0.1.4`

## 0.1.3 - 2026-08-26

- séparation de la documentation en fichiers principaux anglais avec miroirs français
- mise à jour des métadonnées du package et de la version de livraison à `0.1.3`

## 0.1.2 - 2026-08-26

- renommage du projet en BouCamPhoneServ
- alignement des métadonnées npm sur le nouveau nom technique `boucamphoneserv`
- mise à jour du certificat local et des références de marque

## 0.1.1 - 2026-08-26

- ajout d’un QR code local pour accéder rapidement à la page téléphone
- amélioration du tableau de bord multi-téléphones
- affichage de QR codes individuels pour les sources OBS
- ajout d’une documentation complète et d’un tutoriel d’utilisation
- alignement de la version du projet sur `0.1.1`

## 0.1.0 - 2026-08-26

- première base locale WebRTC
- interface téléphone, dashboard et source OBS
- génération d’un certificat local au premier lancement
- compatibilité réseau local avec vidéo et micro

## Soutenir le projet

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licence et contributions

BouCamPhoneServ est sous licence `AGPL-3.0-only`.
Les contributions doivent être signées avec `Signed-off-by:` pour respecter la DCO 1.1.
