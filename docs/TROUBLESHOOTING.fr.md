# Dépannage

[EN](TROUBLESHOOTING.md) | [FR](TROUBLESHOOTING.fr.md) | [ES](TROUBLESHOOTING.es.md)

Page wiki: [Accueil](../wiki/Home.fr.md)

## La caméra ne démarre pas

- vérifie que le téléphone a bien donné l’autorisation
- vérifie que le certificat local a bien été installé
- recharge la page téléphone

## Le téléphone n’apparaît pas sur le dashboard

- vérifie que le téléphone est bien sur le même réseau local
- vérifie l’adresse IP du PC indiquée dans le tableau de bord
- rouvre la page téléphone depuis le QR code ou le lien

## OBS affiche un écran noir

- recharge la source navigateur dans OBS
- vérifie que le téléphone diffuse encore
- vérifie que la source OBS utilise la bonne URL

## Le micro ne marche pas

- vérifie l’autorisation micro sur le téléphone
- vérifie que le micro n’a pas été coupé dans la carte du téléphone
- relance le flux si besoin

## La page téléphone ne s’ouvre pas

- vérifie que tu utilises bien l’adresse HTTPS du PC
- vérifie que le certificat a été installé
- vérifie que le PC et le téléphone sont sur le même Wi-Fi

## Le QR code n’ouvre pas la bonne page

- utilise le lien copié depuis le tableau de bord
- vérifie que le téléphone est bien relié au bon PC

## Le projet ne démarre pas

- vérifie que Node.js est installé
- relance `npm install`
- puis relance `npm start`

## Soutenir le projet

Faire un don : [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licence et contributions

BouCamPhoneServ est sous licence `AGPL-3.0-only`.
Les contributions doivent être signées avec `Signed-off-by:` pour respecter la DCO 1.1.

English version: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
