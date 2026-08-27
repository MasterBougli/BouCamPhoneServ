# Troubleshooting

[EN](TROUBLESHOOTING.md) | [FR](TROUBLESHOOTING.fr.md) | [ES](TROUBLESHOOTING.es.md)

Wiki home: [Home](../wiki/Home.md)

## The Camera Does Not Start

- check that the phone granted permission
- accept the HTTPS warning, or optionally install the local `.cer`/`.crt` certificate to avoid it
- reload the phone page

## The Phone Does Not Appear on the Dashboard

- check that the phone is on the same local network
- check the PC IP address shown in the dashboard
- reopen the phone page from the QR code or link

## OBS Shows a Black Screen

- reload the browser source in OBS
- check that the phone is still streaming
- verify that the OBS source uses the correct URL

## The Microphone Does Not Work

- check microphone permission on the phone
- check that the microphone was not muted in the phone card
- restart the stream if needed

## The Phone Page Does Not Open

- make sure you are using the PC HTTPS address
- accept the browser warning, or optionally install the `.cer`/`.crt` certificate to avoid it
- make sure the PC and the phone are on the same Wi-Fi

## The QR Code Opens the Wrong Page

- use the link copied from the dashboard
- verify that the phone is connected to the correct PC

## The Project Does Not Start

- check that Node.js is installed
- run `npm install` again
- then run `npm start` again

## Support the Project

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## License and Contributions

BouCamPhoneServ is licensed under `AGPL-3.0-only`.
Contributions must be signed off with `Signed-off-by:` to comply with DCO 1.1.

French version: [TROUBLESHOOTING.fr.md](TROUBLESHOOTING.fr.md)
