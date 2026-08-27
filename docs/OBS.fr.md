# Utilisation dans OBS

[EN](OBS.md) | [FR](OBS.fr.md) | [ES](OBS.es.md)

Page wiki: [Accueil](../wiki/Home.fr.md)

## Objectif

Chaque téléphone doit devenir une source séparée dans OBS.

## Ajouter une source

1. copie le lien OBS affiché dans la carte du téléphone
2. dans OBS, ajoute une source de navigateur
3. colle le lien
4. ajuste la taille et le cadrage dans ta scène

## Bon usage

- garde une source par téléphone
- renomme les sources dans OBS
- utilise les états du dashboard pour vérifier si le flux est bien vivant

## Qualité et bitrate

Les profils vidéo associent une résolution cible à un plafond de bitrate WebRTC : le 720p utilise 1, 2,5 ou 4 Mbps ; le 1080p utilise 2,5, 5 ou 8 Mbps ; et le 1440p haute qualité utilise 12 Mbps. La fluidité peut cibler 15, 24, 30 ou 60 FPS. L’audio peut cibler 32 kbps (basse), 48 kbps (normale) ou 64 kbps (haute). Ce sont des plafonds : WebRTC peut réduire le débit réel si le réseau ou le téléphone ne le supporte pas. La page téléphone possède des onglets Identité, Vidéo et Audio pour son nom, sa caméra préférée et ses choix locaux ; chaque sélecteur média peut toujours hériter de la valeur du serveur. La résolution, les FPS, le codec, la lumière et le capteur influencent aussi le rendu final.

## Si une source ne s’affiche pas

- vérifie que le téléphone est bien connecté
- vérifie que le micro ou la caméra n’a pas été coupé
- recharge la source navigateur dans OBS
- si HTTPS est bloqué, accepte l’avertissement du navigateur ou installe éventuellement le certificat `.cer`/`.crt` pour le supprimer

## Conseil

Pour les scènes à plusieurs téléphones, crée une scène OBS dédiée et ajoute chaque source à la main. C’est la façon la plus simple de garder le contrôle du montage.

## Soutenir le projet

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licence et contributions

BouCamPhoneServ est sous licence `AGPL-3.0-only`.
Les contributions doivent être signées avec `Signed-off-by:` pour respecter la DCO 1.1.

English version: [OBS.md](OBS.md)
