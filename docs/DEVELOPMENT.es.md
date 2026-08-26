# Desarrollo

[EN](DEVELOPMENT.md) | [FR](DEVELOPMENT.fr.md) | [ES](DEVELOPMENT.es.md)

Wiki principal: [Inicio](../wiki/Home.es.md)

## Ejecutar en local

```bash
npm start
```

## Archivos principales

- `server.js` para el servidor y la señalización
- `public/dashboard.js` para el panel
- `public/phone.js` para la página del teléfono
- `public/view.js` para la fuente OBS

## Generación del certificado

El script PowerShell ubicado en `scripts/create-local-cert.ps1` crea:

- `certs/local.pfx`
- `certs/local.cer`

## Puntos a tener en cuenta

- mantener el proyecto sin instalación en el teléfono
- conservar la compatibilidad con la red local
- evitar vincular el funcionamiento a un servicio externo

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia y contribuciones

BouCamPhoneServ tiene licencia `AGPL-3.0-only`.
Las contribuciones deben firmarse con `Signed-off-by:` para cumplir con DCO 1.1.
