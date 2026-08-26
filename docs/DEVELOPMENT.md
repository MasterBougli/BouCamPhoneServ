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

French version: [DEVELOPMENT.fr.md](DEVELOPMENT.fr.md)
