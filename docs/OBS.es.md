# Uso en OBS

[EN](OBS.md) | [FR](OBS.fr.md) | [ES](OBS.es.md)

Wiki principal: [Inicio](../wiki/Home.es.md)

## Objetivo

Cada teléfono debe convertirse en una fuente separada dentro de OBS.

## Añadir una fuente

1. copia el enlace OBS mostrado en la tarjeta del teléfono
2. en OBS, añade una fuente de navegador
3. pega el enlace
4. ajusta el tamaño y el encuadre en tu escena

## Buen uso

- mantén una fuente por teléfono
- renombra las fuentes en OBS
- usa el estado del panel para comprobar que el flujo sigue vivo

## Calidad y bitrate

Los perfiles de vídeo combinan una resolución objetivo con un límite de bitrate WebRTC: 720p utiliza 1, 2,5 o 4 Mbps; 1080p utiliza 2,5, 5 u 8 Mbps; y 1440p de alta calidad utiliza 12 Mbps. El audio puede usar 32 kbps (baja), 48 kbps (normal) o 64 kbps (alta). Son límites máximos: WebRTC puede reducir el bitrate real si la red o el teléfono no pueden mantenerlo. La resolución, los fotogramas por segundo, el códec, la iluminación y el sensor también afectan al resultado final.

## Si una fuente no aparece

- comprueba que el teléfono sigue conectado
- comprueba que el micrófono o la cámara no se hayan silenciado
- recarga la fuente del navegador en OBS
- si HTTPS está bloqueado, acepta el aviso del navegador o instala opcionalmente el certificado `.cer`/`.crt` para eliminarlo

## Consejo

Para escenas con varios teléfonos, crea una escena dedicada en OBS y añade cada fuente manualmente. Es la forma más sencilla de mantener el control de la edición.

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia y contribuciones

BouCamPhoneServ tiene licencia `AGPL-3.0-only`.
Las contribuciones deben firmarse con `Signed-off-by:` para cumplir con DCO 1.1.
