# Installation and Certificate

[EN](INSTALLATION.md) | [FR](INSTALLATION.fr.md) | [ES](INSTALLATION.es.md)

## Requirements

- Windows for the current version
- Node.js 20 or newer
- a modern browser on the phone

## Install the Project

In the project folder:

```bash
npm install
```

## Launch the App

```bash
npm start
```

## Local Certificate

BouCamPhoneServ serves the phone page over HTTPS because browsers require a secure context for camera and microphone access.

On the first launch, a local certificate is generated automatically in `certs/`.

The public certificate to install on the phones is available from:

- the dashboard
- or `http://localhost:8080/downloads/local.cer`

## Install on the Phone

1. open the certificate link
2. download the file
3. install it as a trusted certificate
4. then open the phone page

## Network Address

The dashboard shows the LAN addresses detected by the PC.

Use the one that matches your current local network.

## Notes

- no app installation is required on the phone
- no online account is required
- everything stays on the local network

## Support the Project

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## License and Contributions

BouCamPhoneServ is licensed under `AGPL-3.0-only`.
Contributions must be signed off with `Signed-off-by:` to comply with DCO 1.1.

French version: [INSTALLATION.fr.md](INSTALLATION.fr.md)
