# Arquitectura técnica

[EN](ARCHITECTURE.md) | [FR](ARCHITECTURE.fr.md) | [ES](ARCHITECTURE.es.md)

Wiki principal: [Inicio](../wiki/Home.es.md)

## Resumen

BouCamPhoneServ divide el proyecto en tres capas:

- el teléfono
- el servidor local
- la salida OBS

## Flujo de datos

```mermaid
flowchart LR
  Phone["Teléfono en el navegador"]
  Server["Servidor local"]
  Dashboard["Panel"]
  OBS["OBS Browser Source"]

  Phone -->|"cámara + micrófono + señalización"| Server
  Dashboard -->|"control local"| Server
  OBS -->|"visualización separada"| Server
```

## Rol de cada parte

### Teléfono

- abre una página web
- solicita acceso a cámara y micrófono
- envía vídeo y audio
- puede cambiar de cámara o silenciar el micrófono

### Servidor local

- sirve las páginas HTML
- gestiona las sesiones
- reenvía mensajes entre el teléfono y la vista OBS
- proporciona el certificado local

### Panel

- muestra los teléfonos activos
- enseña códigos QR
- permite copiar enlaces
- permite enviar comandos simples

### Fuente OBS

- toma el vídeo de la sesión seleccionada
- muestra cada teléfono como una fuente independiente

## Por qué este enfoque

Este enfoque mantiene:

- una instalación mínima
- amplia compatibilidad con navegadores
- una integración limpia con OBS
- una base que luego puede evolucionar hacia Linux o Raspberry Pi

## Apoya el proyecto

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## Licencia y contribuciones

BouCamPhoneServ tiene licencia `AGPL-3.0-only`.
Las contribuciones deben firmarse con `Signed-off-by:` para cumplir con DCO 1.1.
