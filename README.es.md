# BouCamPhoneServ

[EN](README.md) | [FR](README.fr.md) | [ES](README.es.md)

![Version](https://img.shields.io/badge/version-0.1.10-blue)
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
- un código QR para acceder rápido a la página del teléfono
- enlaces OBS separados para cada dispositivo
- controles simples para renombrar, silenciar, cambiar la cámara y detener una fuente
- un certificado local generado al iniciar por primera vez

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
2. descarga el certificado público desde el panel
3. abre la página del teléfono desde el enlace o el código QR
4. permite el acceso a la cámara y al micrófono
5. añade la fuente OBS en `View` con la URL mostrada para cada sesión

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
- [public/dashboard.html](public/dashboard.html)
- [public/dashboard.js](public/dashboard.js)
- [public/phone.html](public/phone.html)
- [public/phone.js](public/phone.js)
- [public/view.html](public/view.html)
- [public/view.js](public/view.js)
- [scripts/create-local-cert.ps1](scripts/create-local-cert.ps1)

## Versión

Versión actual del proyecto: `0.1.10`

- Notas de la versión: [changelog.md](changelog.md)

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia

AGPL-3.0-only, ver [LICENSE](LICENSE) y [NOTICE](NOTICE.es.md)
