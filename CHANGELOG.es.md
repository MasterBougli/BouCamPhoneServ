# Historial de cambios

[EN](changelog.md) | [FR](CHANGELOG.fr.md) | [ES](CHANGELOG.es.md)

## Resumen

Este historial mantiene la versión más reciente arriba para encontrar rápidamente los cambios más importantes.

## 0.1.23 - 2026-08-27

- reconstrucción de la configuración del teléfono en cuatro pestañas accesibles: Sesión, Identidad, Vídeo y Audio
- agrupación del nombre y los ajustes multimedia locales detrás de una única acción de guardado
- incorporación de una cámara frontal o trasera preferida para cada teléfono
- mantenimiento de una vuelta independiente a los valores del servidor en cada selector multimedia
- incorporación de navegación por teclado y pestañas compactas en dos columnas para pantallas estrechas
- actualización de la versión del proyecto a `0.1.23`

## 0.1.22 - 2026-08-27

- transformación de cada sección de configuración en un panel de pestaña accesible real
- traslado del resumen activo y de los accesos directos de estudio a pestañas dedicadas
- mantenimiento de los controles de guardado independientemente de la pestaña seleccionada
- incorporación de opciones globales de 15, 24, 30 y 60 FPS
- incorporación de prioridades persistentes por teléfono para vídeo, FPS y bitrate de audio
- reaplicación de las restricciones multimedia y límites WebRTC locales sin sustituir la sesión del teléfono
- visualización en el panel de los ajustes multimedia efectivos de cada teléfono
- actualización de la versión del proyecto a `0.1.22`

## 0.1.21 - 2026-08-27

- reducción de aproximadamente el 50 % del espacio interior de las tarjetas sin reducir las zonas táctiles
- transformación de la navegación de configuración en pestañas laterales activas
- sustitución del estado « Sincronizado » por `Ok`
- incorporación de perfiles de bitrate bajo, equilibrado y alto para 720p y 1080p, conservando 1440p de alta calidad
- incorporación de perfiles de audio configurables a 32, 48 y 64 kbps
- aplicación de los límites de bitrate elegidos a los emisores WebRTC de audio y vídeo cuando el navegador lo permite
- actualización de la versión del proyecto a `0.1.21`

## 0.1.20 - 2026-08-27

- rediseño del encabezado de configuración para seguir la presentación compacta del panel
- cambio anticipado de la configuración a una sola columna en anchuras intermedias
- corrección de insignias, URL, botones y descripciones largas que salían de sus tarjetas
- refuerzo de la contención responsive en el panel, mosaico, teléfono, configuración y vista OBS
- incorporación del mosaico a los accesos directos de configuración
- actualización de la versión del proyecto a `0.1.20`

## 0.1.19 - 2026-08-27

- se colocaron las sesiones y el estado del servidor antes de las tarjetas de ayuda del panel
- se añadió visualización progresiva para la conexión del teléfono, la ayuda del certificado y la configuración
- se añadió un mosaico de vídeo adaptable en `/mosaic`
- se añadió señalización WebRTC multi-viewer para recibir el mismo teléfono en OBS y el mosaico simultáneamente
- se añadió un icono de Windows en el área de notificación con accesos rápidos y apagado confirmado del servidor
- se colocó el formulario de configuración antes de su barra de navegación en móviles
- se actualizó la versión del proyecto a `0.1.19`

## 0.1.18 - 2026-08-27

- aclaración en toda la documentación de que la instalación del certificado local `.cer`/`.crt` es opcional
- explicación de que HTTPS sigue siendo obligatorio, mientras que el certificado solo evita el aviso recurrente no reconocido/no seguro del navegador
- documentación de la aceptación manual del aviso HTTPS cuando el navegador y el dispositivo lo permitan
- actualización de la versión del proyecto a `0.1.18`

## 0.1.17 - 2026-08-27

- rediseño completo de todas las interfaces con un sistema visual de control OLED generado con UI UX Pro Max
- incorporación de una disposición Bento adaptable, tipografía orientada a producción, colores semánticos e iconos SVG coherentes
- mejora del foco de teclado, los objetivos táctiles, el zoom móvil, la semántica de formularios y la reducción de movimiento
- actualización de la versión del proyecto a `0.1.17`

## 0.1.16 - 2026-08-26

- la pantalla de configuración pasó a una disposición estilo studio con barra lateral, navegación por secciones y tarjetas de accesos directos
- se añadió una jerarquía visual más clara y marcadores tipo icono en los controles de configuración
- se actualizó la versión del proyecto a `0.1.16`

## 0.1.15 - 2026-08-26

- rediseño de la página de configuración en secciones más claras para red, cámara, audio, arranque y accesos directos
- añadido el descargable del lanzador y los atajos de comando directamente en la pantalla de configuración
- se actualizó la versión del proyecto a `0.1.15`

## 0.1.14 - 2026-08-26

- se añadió un lanzador de Windows con un clic y el atajo `npm run config` para la página de configuración
- la página de configuración aplica los ajustes al instante con un feedback más claro
- se mantuvo el comportamiento de arranque automático mediante los ajustes compartidos del servidor
- se actualizó la versión del proyecto a `0.1.14`

## 0.1.13 - 2026-08-26

- se añadió una página de configuración gráfica conectada a los ajustes compartidos del servidor
- se enlazó el panel con la pantalla de configuración y se mostraron los ajustes activos
- se actualizó la versión del proyecto a `0.1.13`

## 0.1.12 - 2026-08-26

- se añadieron comentarios en francés en las funciones principales del código
- se actualizó la versión del proyecto a `0.1.12`

## 0.1.11 - 2026-08-26

- eliminados los antiguos archivos `docs/TUTORIAL.*` para que la carpeta wiki sea la única fuente del tutorial
- añadidos enlaces al wiki en las demás guías para una navegación más práctica
- actualización de la versión del proyecto a `0.1.11`

## 0.1.10 - 2026-08-26

- movido el contenido del tutorial a la carpeta `wiki/` como páginas Markdown dedicadas
- enlazadas las secciones de tutorial e instalación del README a las páginas wiki
- actualización de la versión del proyecto a `0.1.10`

## 0.1.9 - 2026-08-26

- añadidos badges y una sección wiki en los README
- añadido un pequeño conjunto NOTICE para explicar la licencia y el flujo DCO
- añadidas páginas wiki listas para usar sobre instalación y uso en EN, FR y ES
- actualización de la versión del proyecto a `0.1.9`

## 0.1.8 - 2026-08-26

- añadidos los badges finales en los README para una portada más limpia
- añadido un archivo de licencia AGPLv3 completo
- reformateado el historial con un resumen más claro
- actualización de la versión del proyecto a `0.1.8`

## 0.1.7 - 2026-08-26

- renombrado el changelog principal a `changelog.md`
- añadida una sección Versión más visible en el README
- actualización de la metadata del paquete a `0.1.7`

## 0.1.6 - 2026-08-26

- se añadieron las versiones en español para los archivos Markdown restantes
- se añadieron enlaces de idioma completos EN/FR/ES en la parte superior de la documentación
- se actualizó la metadata del paquete a `0.1.6`

## 0.1.5 - 2026-08-26

- se añadió un README en español junto a las versiones en inglés y francés
- se añadieron enlaces de idioma en la parte superior de los archivos README
- se actualizó la metadata del paquete a `0.1.5`

## 0.1.4 - 2026-08-26

- se añadieron enlaces de donación a la documentación Markdown
- se cambió la nota de licencia del proyecto a AGPLv3 más DCO
- se actualizó la metadata del paquete a `0.1.4`

## 0.1.3 - 2026-08-26

- se separó la documentación en archivos principales en inglés con espejos en francés
- se actualizó la metadata del paquete del repositorio y la versión de entrega a `0.1.3`

## 0.1.2 - 2026-08-26

- se cambió el nombre del proyecto a BouCamPhoneServ
- se alineó la metadata de npm con el nuevo nombre técnico `boucamphoneserv`
- se actualizaron el certificado local y las referencias de marca

## 0.1.1 - 2026-08-26

- se añadió un código QR local para acceder rápidamente a la página del teléfono
- se mejoró el panel multi-teléfono
- se mostraron códigos QR individuales para las fuentes OBS
- se añadió documentación completa y un tutorial de uso
- se alineó la versión del proyecto con `0.1.1`

## 0.1.0 - 2026-08-26

- primera base local WebRTC
- interfaz de teléfono, panel y fuente OBS
- generación de un certificado local al primer arranque
- compatibilidad en red local con vídeo y micrófono

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia y contribuciones

BouCamPhoneServ tiene licencia `AGPL-3.0-only`.
Las contribuciones deben firmarse con `Signed-off-by:` para cumplir con DCO 1.1.
