# Instalación y certificado

[EN](INSTALLATION.md) | [FR](INSTALLATION.fr.md) | [ES](INSTALLATION.es.md)

## Requisitos

- Windows para la versión actual
- Node.js 20 o más reciente
- un navegador moderno en el teléfono

## Instala el proyecto

En la carpeta del proyecto:

```bash
npm install
```

## Inicia la aplicación

```bash
npm start
```

## Certificado local

BouCamPhoneServ sirve la página del teléfono por HTTPS porque los navegadores requieren un contexto seguro para acceder a la cámara y al micrófono.

En el primer arranque, se genera automáticamente un certificado local en `certs/`.

El certificado público que debes instalar en los teléfonos está disponible desde:

- el panel
- o `http://localhost:8080/downloads/local.cer`

## Instálalo en el teléfono

1. abre el enlace del certificado
2. descarga el archivo
3. instálalo como certificado de confianza
4. luego abre la página del teléfono

## Dirección de red

El panel muestra las direcciones LAN detectadas por el PC.

Usa la que coincida con tu red local actual.

## Notas

- no hace falta instalar ninguna app en el teléfono
- no hace falta una cuenta en línea
- todo se queda en la red local

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia y contribuciones

BouCamPhoneServ tiene licencia `AGPL-3.0-only`.
Las contribuciones deben firmarse con `Signed-off-by:` para cumplir con DCO 1.1.
