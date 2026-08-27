# BouCamPhoneServ

[EN](README.md) | [FR](README.fr.md) | [ES](README.es.md)

![Version](https://img.shields.io/badge/version-0.1.22-blue)
![License](https://img.shields.io/badge/license-AGPL--3.0--only-green)
![Docs](https://img.shields.io/badge/docs-EN%2FFR%2FES-orange)
![Wiki](https://img.shields.io/badge/wiki-ready-purple)

BouCamPhoneServ es un puente local para usar la cámara y el micrófono de uno o varios teléfonos dentro de OBS sin instalar nada en los móviles.

Este proyecto está licenciado bajo `AGPL-3.0-only` y las contribuciones se gestionan bajo DCO 1.1.

El proyecto está pensado para:

- uso en red local
- iPhone y Android
- varios teléfonos al mismo tiempo
- fuentes OBS separadas por teléfono
- una interfaz cuidada desde el primer día

## Qué incluye esta versión

- una página de teléfono que se abre en el navegador
- un panel local para el PC
- un mosaico de vídeo disponible en `http://localhost:8080/mosaic`
- señalización multi-viewer para ver un teléfono en el mosaico y OBS al mismo tiempo
- un icono de Windows junto al reloj con accesos al panel, mosaico, configuración y apagado seguro
- una página de configuración gráfica para los ajustes compartidos del servidor
- perfiles de vídeo 720p, 1080p y 1440p con bitrate configurado, además de perfiles de audio a 32/48/64 kbps
- prioridades de vídeo, FPS y audio por teléfono con opción de volver a los valores del servidor
- una consola de configuración completamente organizada en pestañas, incluido el resumen y los accesos directos
- un lanzador de Windows y el atajo `npm run config` para abrir la configuración
- un diseño por secciones para red, cámara, audio, arranque y accesos directos
- una barra lateral estilo studio con navegación rápida y tarjetas de accesos directos
- un código QR para acceder rápido a la página del teléfono
- enlaces OBS separados para cada dispositivo
- controles simples para renombrar, silenciar, cambiar la cámara y detener una fuente
- un certificado local opcional generado al iniciar por primera vez para evitar el aviso HTTPS no reconocido del navegador

## Inicio rápido

```bash
npm install
```

Luego:

```bash
npm start
```

Después:

1. abre `http://localhost:8080` en el PC
2. abre la página de configuración si quieres ajustar los valores por defecto, o ejecuta `npm run config` / `open-config.cmd`
3. instala opcionalmente el certificado público `.cer`/`.crt` para evitar el aviso de seguridad HTTPS, o acepta manualmente el aviso si tu navegador lo permite
4. abre la página del teléfono desde el enlace o el código QR
5. permite el acceso a la cámara y al micrófono
6. añade la fuente OBS en `View` con la URL mostrada para cada sesión
7. abre `http://localhost:8080/mosaic` para supervisar juntas todas las cámaras activas

En Windows, el servidor también aparece en el área de notificación junto al reloj. Haz doble clic en el icono para abrir el panel, o clic derecho para abrir el mosaico, la configuración o detener el servidor.

## Documentación

- [Tutorial wiki](wiki/Tutorial.es.md), [FR](wiki/Tutorial.fr.md), [EN](wiki/Tutorial.md)
- [Instalación wiki](wiki/Installation.es.md), [FR](wiki/Installation.fr.md), [EN](wiki/Installation.md)
- [Uso wiki](wiki/Usage.es.md), [FR](wiki/Usage.fr.md), [EN](wiki/Usage.md)
- [Configuración OBS](docs/OBS.md), [FR](docs/OBS.fr.md), [ES](docs/OBS.es.md)
- [Arquitectura técnica](docs/ARCHITECTURE.md), [FR](docs/ARCHITECTURE.fr.md), [ES](docs/ARCHITECTURE.es.md)
- [Solución de problemas](docs/TROUBLESHOOTING.md), [FR](docs/TROUBLESHOOTING.fr.md), [ES](docs/TROUBLESHOOTING.es.md)
- [Notas de desarrollo](docs/DEVELOPMENT.md), [FR](docs/DEVELOPMENT.fr.md), [ES](docs/DEVELOPMENT.es.md)
- [Contribuir al proyecto](CONTRIBUTING.md), [FR](CONTRIBUTING.fr.md), [ES](CONTRIBUTING.es.md)
- [Historial de cambios](CHANGELOG.es.md), [FR](CHANGELOG.fr.md), [EN](changelog.md)
- [Wiki principal](wiki/Home.es.md), [FR](wiki/Home.fr.md), [EN](wiki/Home.md)

## Archivos importantes

- [server.js](server.js)
- [config/settings.json](config/settings.json)
- [public/dashboard.html](public/dashboard.html)
- [public/dashboard.js](public/dashboard.js)
- [public/config.html](public/config.html)
- [public/config.js](public/config.js)
- [public/mosaic.html](public/mosaic.html)
- [public/mosaic.js](public/mosaic.js)
- [scripts/server-tray.ps1](scripts/server-tray.ps1)
- [open-config.cmd](open-config.cmd)
- [scripts/open-config.ps1](scripts/open-config.ps1)
- [public/phone.html](public/phone.html)
- [public/phone.js](public/phone.js)
- [public/view.html](public/view.html)
- [public/view.js](public/view.js)
- [scripts/create-local-cert.ps1](scripts/create-local-cert.ps1)

## Versión

Versión actual del proyecto: `0.1.22`

- Notas de la versión: [changelog.md](changelog.md)

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia

AGPL-3.0-only, ver [LICENSE](LICENSE) y [NOTICE](NOTICE.es.md)
