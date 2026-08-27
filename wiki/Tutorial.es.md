# Tutorial

[EN](Tutorial.md) | [FR](Tutorial.fr.md) | [ES](Tutorial.es.md)

Este tutorial explica cómo usar BouCamPhoneServ de principio a fin.

## 1. Inicia el servidor

En el PC con Windows, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Luego:

```bash
npm start
```

El servidor arranca en:

- `http://localhost:8080`
- `https://<direccion-ip-del-pc>:8443`

## 2. Abre el panel

En el PC, abre:

- `http://localhost:8080`

Verás:

- un código QR para abrir la página del teléfono
- el enlace del certificado público
- estadísticas de los teléfonos conectados
- la lista de fuentes OBS por teléfono

## 3. Instala opcionalmente el certificado local

HTTPS es obligatorio para la cámara y el micrófono, pero la instalación del
certificado local es opcional. Puedes aceptar manualmente el aviso del navegador
cuando el dispositivo lo permita. Instalar el archivo `.cer` (también llamado
`.crt` en algunas plataformas) solo evita el aviso HTTPS no reconocido/no seguro recurrente.

En el panel:

1. descarga el certificado público
2. abre el archivo en el teléfono
3. instálalo como certificado de confianza
4. vuelve al navegador

Esto no es una instalación de app y puedes omitirlo. Solo es un paso de
confianza que elimina el aviso del navegador.

## 4. Abre la página del teléfono

Puedes:

- escanear el código QR del panel
- copiar el enlace del teléfono
- abrir directamente la URL `https://<direccion-ip-del-pc>:8443/phone`

La página del teléfono pide:

- la cámara
- el micrófono

Una vez aceptado, el teléfono aparece en el panel.

## 5. Renombra el teléfono

En la tarjeta del teléfono en el panel:

1. haz clic en `Renombrar`
2. dale un nombre claro, por ejemplo `Camara Salon` o `Cam Face`
3. confirma

Esto es útil cuando se usan varios teléfonos al mismo tiempo.

## 6. Añade la fuente en OBS

Para cada teléfono:

1. copia el enlace OBS mostrado en su tarjeta
2. en OBS, añade una fuente de navegador
3. pega la URL
4. ajusta el tamaño según tu escena

Cada teléfono se convierte en una fuente separada.

## 7. Gestiona varios teléfonos

El panel muestra para cada dispositivo:

- estado de conexión
- cámara activa
- estado del micrófono
- enlace OBS dedicado

También puedes:

- cambiar entre cámara frontal y trasera
- silenciar el micrófono
- detener un teléfono sin afectar a los demás

## 8. Cierra correctamente

Cuando termines:

1. detén las fuentes en OBS si hace falta
2. cierra las páginas del teléfono
3. detén el servidor local

## Consejo práctico

Si usas a menudo los mismos teléfonos, deja el certificado instalado. No tendrás que repetir ese paso cada vez.

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia y contribuciones

BouCamPhoneServ tiene licencia `AGPL-3.0-only`.
Las contribuciones deben firmarse con `Signed-off-by:` para cumplir con DCO 1.1.
