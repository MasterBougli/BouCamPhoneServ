# Utilisation

[EN](Usage.md) | [FR](Usage.fr.md) | [ES](Usage.es.md)

## Parcours téléphone

1. ouvre le tableau de bord sur le PC
2. installe éventuellement le certificat local `.cer`/`.crt`, ou accepte manuellement l’avertissement HTTPS lorsque c’est possible
3. ouvre la page téléphone avec le QR code ou le lien
4. autorise la caméra et le micro
5. ajoute la source navigateur OBS pour la session

## Contrôles quotidiens

- renommer le téléphone
- changer de caméra avant / arrière
- couper le micro
- arrêter un téléphone sans toucher aux autres

## Qualité par téléphone

Utilise les onglets **Session**, **Identité**, **Vidéo** et **Audio** de la page téléphone pour définir son nom local, sa caméra frontale ou arrière préférée, son profil vidéo, ses FPS et son bitrate audio. Chaque sélecteur média peut rester sur **Réglage du serveur**, puis le bouton **Enregistrer les réglages** mémorise tous les choix dans le navigateur du téléphone. Appliquer les choix vidéo pendant un direct recrée brièvement les pistes média, mais conserve la même session et la même URL OBS.

## Mosaïque de caméras

Ouvre `http://localhost:8080/mosaic` pour surveiller tous les téléphones actifs dans une grille responsive. Chaque tuile démarre sans son pour respecter les règles de lecture automatique des navigateurs ; utilise **Activer le son** uniquement sur les caméras que tu veux entendre. L’ouverture de la mosaïque ne remplace pas une vue OBS.

## Icône de notification Windows

Pendant que le serveur fonctionne sous Windows, son icône est visible dans la zone de notification près de l’horloge. Double-clique pour ouvrir le tableau de bord, ou fais un clic droit pour accéder au tableau de bord, à la mosaïque, à la configuration et à l’arrêt confirmé du serveur.

## Liens utiles

- [Tutoriel complet](Tutorial.fr.md)
- [Guide d’installation](Installation.fr.md)

## Soutien

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)
