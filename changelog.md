# Changelog

[EN](changelog.md) | [FR](CHANGELOG.fr.md) | [ES](CHANGELOG.es.md)

## Summary

This log keeps the newest release at the top so the most relevant changes are easy to find.

## 0.1.20 - 2026-08-27

- redesigned the configuration header to match the compact studio dashboard
- moved the configuration layout to one column earlier on medium-width screens
- fixed status badges, URLs, buttons, and long descriptions escaping their cards
- strengthened responsive containment across the dashboard, mosaic, phone, configuration, and OBS pages
- added the camera mosaic to the configuration shortcuts
- updated the project version to `0.1.20`

## 0.1.19 - 2026-08-27

- moved live sessions and server status ahead of onboarding cards on the dashboard
- added progressive disclosure for phone setup, certificate help, and configuration details
- added a responsive live camera mosaic at `/mosaic`
- added multi-viewer WebRTC signaling so OBS and the mosaic can receive the same phone concurrently
- added a Windows notification-area icon with quick links and a confirmed server shutdown action
- moved the configuration form before its navigation rail on mobile
- updated the project version to `0.1.19`

## 0.1.18 - 2026-08-27

- clarified throughout the documentation that installing the local `.cer`/`.crt` certificate is optional
- explained that HTTPS remains required, while the certificate only avoids the recurring untrusted/non-secure browser warning
- documented manual acceptance of the HTTPS warning when supported by the browser and device
- updated the project version to `0.1.18`

## 0.1.17 - 2026-08-27

- rebuilt every interface around an OLED broadcast-control design system generated with UI UX Pro Max
- introduced a responsive Bento layout, production-focused typography, semantic colors, and consistent SVG icons
- improved keyboard focus, touch targets, mobile zoom, form semantics, and reduced-motion support
- updated the project version to `0.1.17`

## 0.1.16 - 2026-08-26

- turned the configuration screen into a studio-style layout with a sidebar, section navigation, and shortcut cards
- added more visual hierarchy and icon-like markers to the configuration controls
- updated the project version to `0.1.16`

## 0.1.15 - 2026-08-26

- redesigned the configuration page into clearer sections for network, camera, audio, startup, and shortcuts
- added launcher downloads and command shortcuts directly into the configuration screen
- updated the project version to `0.1.15`

## 0.1.14 - 2026-08-26

- added a one-click Windows launcher and an `npm run config` shortcut for the configuration page
- made the configuration page apply settings immediately with clearer feedback
- kept automatic startup behavior through the shared server settings
- updated the project version to `0.1.14`

## 0.1.13 - 2026-08-26

- added a graphical configuration page backed by shared server settings
- linked the dashboard to the new configuration screen and surfaced the active settings
- updated the project version to `0.1.13`

## 0.1.12 - 2026-08-26

- added French comments to the main code functions
- updated the project version to `0.1.12`

## 0.1.11 - 2026-08-26

- removed the old `docs/TUTORIAL.*` files so the wiki folder is the single tutorial source
- added wiki home links to the remaining docs for a more practical navigation flow
- updated the project version to `0.1.11`

## 0.1.10 - 2026-08-26

- moved the tutorial content into the `wiki/` folder as dedicated Markdown pages
- linked the README tutorial and setup sections to the wiki pages
- updated the project version to `0.1.10`

## 0.1.9 - 2026-08-26

- added badges and a wiki section to the README files
- added a small NOTICE set to explain the license and DCO workflow
- added wiki-ready installation and usage pages in EN, FR, and ES
- updated the project version to `0.1.9`

## 0.1.8 - 2026-08-26

- added the final README badges for a cleaner repository landing page
- added a dedicated full AGPLv3 license file
- refined the changelog into a more polished summary-first format
- updated the project version to `0.1.8`

## 0.1.7 - 2026-08-26

- added a dedicated lower-case `changelog.md` file and linked the README version section to it
- updated the project version to `0.1.7`

## 0.1.6 - 2026-08-26

- added Spanish versions for the remaining Markdown files
- added full EN/FR/ES language links to the top of the docs
- updated the package metadata to `0.1.6`

## 0.1.5 - 2026-08-26

- added a Spanish README alongside the English and French versions
- added language links at the top of the README files
- updated the package metadata to `0.1.5`

## 0.1.4 - 2026-08-26

- added donation links to the Markdown documentation
- switched the project license notice to AGPLv3 plus DCO
- updated the package metadata to `0.1.4`

## 0.1.3 - 2026-08-26

- split the documentation into English primary files with French mirrors
- updated the repository package metadata and release version to `0.1.3`

## 0.1.2 - 2026-08-26

- renamed the project to BouCamPhoneServ
- aligned npm metadata with the new technical name `boucamphoneserv`
- refreshed the local certificate and branding references

## 0.1.1 - 2026-08-26

- added a local QR code for quick access to the phone page
- improved the multi-phone dashboard
- displayed individual QR codes for OBS sources
- added full documentation and a usage tutorial
- aligned the project version to `0.1.1`

## 0.1.0 - 2026-08-26

- first local WebRTC base
- phone, dashboard, and OBS source interface
- local certificate generation on first launch
- local network compatibility for video and microphone

## Support the Project

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## License and Contributions

BouCamPhoneServ is licensed under `AGPL-3.0-only`.
Contributions must be signed off with `Signed-off-by:` to comply with DCO 1.1.
