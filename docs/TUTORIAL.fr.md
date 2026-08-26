# Tutoriel d’utilisation

[EN](TUTORIAL.md) | [FR](TUTORIAL.fr.md) | [ES](TUTORIAL.es.md)

Ce guide explique comment utiliser BouCamPhoneServ du début à la fin.

## 1. Lancer le serveur

Sur le PC Windows, ouvre un terminal dans le dossier du projet puis lance :

```bash
npm install
```

Puis :

```bash
npm start
```

Le serveur démarre sur :

- `http://localhost:8080`
- `https://<adresse-ip-du-pc>:8443`

## 2. Ouvrir le tableau de bord

Sur le PC, ouvre :

- `http://localhost:8080`

Tu verras :

- un QR code pour ouvrir la page téléphone
- le lien du certificat public
- les statistiques des téléphones connectés
- la liste des sources OBS par téléphone

## 3. Installer le certificat local

Pour que la caméra et le micro fonctionnent dans le navigateur du téléphone, il faut faire confiance au certificat local une seule fois.

Dans le tableau de bord :

1. télécharge le certificat public
2. ouvre le fichier sur le téléphone
3. installe-le comme certificat de confiance
4. reviens dans le navigateur

Cette étape n’est pas une installation d’application. C’est juste une validation de sécurité du navigateur.

## 4. Ouvrir la page téléphone

Tu peux :

- scanner le QR code du tableau de bord
- copier le lien téléphone
- ouvrir directement l’URL `https://<adresse-ip-du-pc>:8443/phone`

La page téléphone demande :

- la caméra
- le micro

Une fois accepté, le téléphone apparaît dans le tableau de bord.

## 5. Renommer le téléphone

Dans la carte du téléphone sur le dashboard :

1. clique sur `Renommer`
2. donne un nom clair, par exemple `Cam Salon` ou `Cam Face`
3. valide

C’est utile quand tu utilises plusieurs mobiles en même temps.

## 6. Ajouter la source dans OBS

Pour chaque téléphone :

1. copie le lien OBS affiché dans sa carte
2. dans OBS, ajoute une source de navigateur
3. colle l’URL
4. coche les options de taille selon ta scène

Chaque téléphone devient une source séparée.

## 7. Gérer plusieurs téléphones

Le tableau de bord affiche pour chaque appareil :

- l’état de connexion
- la caméra active
- l’état du micro
- le lien OBS dédié

Tu peux aussi :

- changer la caméra avant / arrière
- couper le micro
- arrêter un téléphone sans toucher aux autres

## 8. Fermer proprement

Quand tu as fini :

1. arrête les sources dans OBS si nécessaire
2. ferme les pages téléphone
3. arrête le serveur local

## Astuce pratique

Si tu utilises souvent les mêmes téléphones, garde le certificat installé. Tu n’auras plus à refaire cette étape à chaque fois.

## Soutenir le projet

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licence et contributions

BouCamPhoneServ est sous licence `AGPL-3.0-only`.
Les contributions doivent être signées avec `Signed-off-by:` pour respecter la DCO 1.1.

English version: [TUTORIAL.md](TUTORIAL.md)
