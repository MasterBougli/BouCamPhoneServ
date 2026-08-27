# Solución de problemas

[EN](TROUBLESHOOTING.md) | [FR](TROUBLESHOOTING.fr.md) | [ES](TROUBLESHOOTING.es.md)

Wiki principal: [Inicio](../wiki/Home.es.md)

## La cámara no arranca

- comprueba que el teléfono haya dado permiso
- acepta el aviso HTTPS, o instala opcionalmente el certificado local `.cer`/`.crt` para evitarlo
- recarga la página del teléfono

## El teléfono no aparece en el panel

- comprueba que el teléfono esté en la misma red local
- comprueba la dirección IP del PC que muestra el panel
- vuelve a abrir la página del teléfono desde el código QR o el enlace

## OBS muestra una pantalla negra

- recarga la fuente del navegador en OBS
- comprueba que el teléfono siga transmitiendo
- verifica que la fuente OBS use la URL correcta

## El micrófono no funciona

- comprueba el permiso de micrófono en el teléfono
- comprueba que el micrófono no se haya silenciado en la tarjeta del teléfono
- reinicia el flujo si hace falta

## La página del teléfono no se abre

- asegúrate de estar usando la dirección HTTPS del PC
- acepta el aviso del navegador, o instala opcionalmente el certificado `.cer`/`.crt` para evitarlo
- asegúrate de que el PC y el teléfono estén en el mismo Wi-Fi

## El código QR abre la página equivocada

- usa el enlace copiado desde el panel
- verifica que el teléfono esté conectado al PC correcto

## El proyecto no arranca

- comprueba que Node.js esté instalado
- ejecuta `npm install` otra vez
- luego ejecuta `npm start` otra vez

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia y contribuciones

BouCamPhoneServ tiene licencia `AGPL-3.0-only`.
Las contribuciones deben firmarse con `Signed-off-by:` para cumplir con DCO 1.1.
