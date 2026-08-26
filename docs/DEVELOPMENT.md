# Development

## Run Locally

```bash
npm start
```

## Main Files

- `server.js` for the server and signaling
- `public/dashboard.js` for the dashboard
- `public/phone.js` for the phone page
- `public/view.js` for the OBS source

## Certificate Generation

The PowerShell script in `scripts/create-local-cert.ps1` creates:

- `certs/local.pfx`
- `certs/local.cer`

## Points to Watch

- keep the project free of phone-side installation
- preserve local network compatibility
- avoid tying the runtime to an external service

## Support the Project

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## License and Contributions

BouCamPhoneServ is licensed under `AGPL-3.0-only`.
Contributions must be signed off with `Signed-off-by:` to comply with DCO 1.1.

French version: [DEVELOPMENT.fr.md](DEVELOPMENT.fr.md)
