# Usage

[EN](Usage.md) | [FR](Usage.fr.md) | [ES](Usage.es.md)

## Phone Flow

1. open the dashboard on the PC
2. optionally install the local `.cer`/`.crt` certificate, or manually accept the HTTPS warning when supported
3. open the phone page by QR code or link
4. allow camera and microphone access
5. add the OBS browser source for the session

## Everyday Controls

- rename the phone
- switch front and rear cameras
- mute the microphone
- stop one phone without affecting the others

## Per-Phone Quality

Open **Streaming quality** on the phone page to override the server's video profile, frame rate, or audio bitrate for that phone only. Each selector can remain on **Server setting**, and local choices are stored in that phone's browser. Applying quality during a live stream briefly recreates the media tracks but keeps the same session and OBS URL.

## Camera Mosaic

Open `http://localhost:8080/mosaic` to monitor every active phone in one responsive grid. Each tile starts muted to satisfy browser autoplay rules; use **Enable audio** only on the cameras you need to hear. Opening the mosaic does not replace an OBS viewer.

## Windows Notification Icon

While the server runs on Windows, its icon is available in the notification area near the clock. Double-click it for the dashboard, or right-click for the dashboard, mosaic, configuration, and confirmed server shutdown.

## Helpful Links

- [Full tutorial](Tutorial.md)
- [Installation guide](Installation.md)

## Support

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)
