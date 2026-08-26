# Tutorial

[EN](TUTORIAL.md) | [FR](TUTORIAL.fr.md) | [ES](TUTORIAL.es.md)

This guide explains how to use BouCamPhoneServ from start to finish.

## 1. Start the server

On the Windows PC, open a terminal in the project folder and run:

```bash
npm install
```

Then:

```bash
npm start
```

The server starts on:

- `http://localhost:8080`
- `https://<pc-ip-address>:8443`

## 2. Open the dashboard

On the PC, open:

- `http://localhost:8080`

You will see:

- a QR code to open the phone page
- the public certificate link
- connected phone statistics
- the list of OBS sources per phone

## 3. Install the local certificate

For camera and microphone access to work in the phone browser, the local certificate must be trusted once.

In the dashboard:

1. download the public certificate
2. open the file on the phone
3. install it as a trusted certificate
4. return to the browser

This is not an app installation. It is only a browser security trust step.

## 4. Open the phone page

You can:

- scan the dashboard QR code
- copy the phone link
- open the URL directly: `https://<pc-ip-address>:8443/phone`

The phone page asks for:

- the camera
- the microphone

Once accepted, the phone appears in the dashboard.

## 5. Rename the phone

In the phone card on the dashboard:

1. click `Rename`
2. give it a clear name, for example `Living Room Cam` or `Face Cam`
3. confirm

This is useful when several phones are used at the same time.

## 6. Add the source in OBS

For each phone:

1. copy the OBS link shown in its card
2. in OBS, add a browser source
3. paste the URL
4. adjust the size settings for your scene

Each phone becomes a separate source.

## 7. Manage multiple phones

The dashboard shows for each device:

- connection status
- active camera
- microphone status
- dedicated OBS link

You can also:

- switch between front and rear cameras
- mute the microphone
- stop one phone without affecting the others

## 8. Close cleanly

When you are finished:

1. stop the sources in OBS if needed
2. close the phone pages
3. stop the local server

## Practical Tip

If you often use the same phones, keep the certificate installed. You will not need to repeat that step every time.

## Support the Project

Donate: [https://streamlabs.com/bouglitv](https://streamlabs.com/bouglitv)

## License and Contributions

BouCamPhoneServ is licensed under `AGPL-3.0-only`.
Contributions must be signed off with `Signed-off-by:` to comply with DCO 1.1.

French version: [TUTORIAL.fr.md](TUTORIAL.fr.md)
