# Instalación

[EN](Installation.md) | [FR](Installation.fr.md) | [ES](Installation.es.md)

## Requisitos

- Windows para la versión actual
- Node.js 20 o más reciente
- un navegador moderno en el teléfono

## Instalar y arrancar

```bash
npm install
npm start
```

## Certificado local

El panel ofrece el certificado público `.cer` opcional (también llamado `.crt`
en algunas plataformas). HTTPS es obligatorio para la cámara y el micrófono,
pero instalar el certificado no lo es: puedes aceptar manualmente el aviso del
navegador cuando sea posible. Su instalación solo evita el aviso HTTPS no
reconocido/no seguro recurrente.

## Qué abrir

- Panel: `http://localhost:8080`
- Página del teléfono: `https://<direccion-ip-del-pc>:8443/phone`

## Apoyo

Donar: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)
