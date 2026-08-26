# Technical Architecture

## Overview

BouCamPhoneServ separates the project into three layers:

- the phone
- the local server
- the OBS output

## Data Flow

```mermaid
flowchart LR
  Phone["Phone in the browser"]
  Server["Local server"]
  Dashboard["Dashboard"]
  OBS["OBS Browser Source"]

  Phone -->|"camera + microphone + signaling"| Server
  Dashboard -->|"local control"| Server
  OBS -->|"separate display"| Server
```

## Role of Each Part

### Phone

- opens a web page
- requests camera and microphone access
- sends video and audio
- can switch camera or mute the microphone

### Local Server

- serves the HTML pages
- manages sessions
- forwards messages between the phone and the OBS view
- provides the local certificate

### Dashboard

- shows active phones
- displays QR codes
- lets you copy links
- lets you send simple commands

### OBS Source

- pulls video from the selected session
- shows each phone as an independent source

## Why This Approach

This approach keeps:

- the installation footprint minimal
- broad browser compatibility
- a clean OBS integration
- a base that can later evolve toward Linux or Raspberry Pi

French version: [ARCHITECTURE.fr.md](ARCHITECTURE.fr.md)
