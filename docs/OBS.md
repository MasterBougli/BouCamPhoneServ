# Using in OBS

[EN](OBS.md) | [FR](OBS.fr.md) | [ES](OBS.es.md)

Wiki home: [Home](../wiki/Home.md)

## Goal

Each phone should become a separate source in OBS.

## Add a Source

1. copy the OBS link shown in the phone card
2. in OBS, add a browser source
3. paste the link
4. adjust the size and framing in your scene

## Good Practice

- keep one source per phone
- rename the sources in OBS
- use the dashboard status to confirm the stream is still alive

## Quality and Bitrate

Video profiles combine a target resolution with a WebRTC bitrate ceiling: 720p uses 1, 2.5, or 4 Mbps; 1080p uses 2.5, 5, or 8 Mbps; and 1440p high quality uses 12 Mbps. Frame rate can target 15, 24, 30, or 60 FPS. Audio can target 32 kbps (low), 48 kbps (normal), or 64 kbps (high). These are ceilings: WebRTC may lower the actual bitrate when the network or phone cannot sustain it. Each phone can inherit the server values or store local overrides. Resolution, frame rate, codec, lighting, and sensor quality also affect the final image.

## If a Source Does Not Appear

- check that the phone is still connected
- check that the microphone or camera has not been muted
- reload the browser source in OBS
- if HTTPS is blocked, accept the browser warning or optionally install the `.cer`/`.crt` certificate to remove it

## Tip

For multi-phone scenes, create a dedicated OBS scene and add each source manually. That is the simplest way to keep control over the edit.

## Support the Project

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## License and Contributions

BouCamPhoneServ is licensed under `AGPL-3.0-only`.
Contributions must be signed off with `Signed-off-by:` to comply with DCO 1.1.

French version: [OBS.fr.md](OBS.fr.md)
