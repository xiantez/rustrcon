# 🎮 RustRCON

A web-based RCON dashboard for [Rust](https://rust.facepunch.com/) game servers. Connect to any Rust server's RCON from your browser — no installation beyond Node.js required.

![License](https://img.shields.io/github/license/xiantez/rustrcon)

## Features

- **Login & Saved Servers** — Enter your server's IP, RCON port, and password. Servers are saved in your browser for quick reconnect.
- **Overview Dashboard** — Live KPIs: player count, FPS, entities, game time, uptime, world size/seed, network I/O, and server identity. Includes sparkline charts, quick server reboot, and weather convar toggles (Fog, Rain, Wind, etc.).
- **Player Management** — View online players, click for Steam profile details (avatar, VAC status, profile links), kick or ban directly.
- **Console & Chat** — Real-time server console with auto-tailing logs, command history (↑/↓), Discord Logger noise filtering, and a dedicated in-game chat panel.
- **Give Items** — Searchable database of 1,193 Rust items. Queue multiple items and send them all at once to any player.
- **7 Themes** — Midnight Sky, Deep Ocean, Emerald Forest, Sunset Rose, Golden Amber, Neon Violet, and Dark Mode.
- **No Credentials Stored on Server** — All connection info stays in your browser's localStorage. Safe to self-host.

## Requirements

- [Node.js](https://nodejs.org/) v14 or later (v18+ recommended)
- A Rust server with WebRCON enabled (`+rcon.web 1`)

## Quick Start

### macOS / Linux

```bash
git clone https://github.com/xiantez/rustrcon.git
cd rustrcon
./start.sh
```

### Windows

```cmd
git clone https://github.com/xiantez/rustrcon.git
cd rustrcon
start.bat
```

### Manual

```bash
git clone https://github.com/xiantez/rustrcon.git
cd rustrcon/backend
npm install
node index.js
```

Then open **http://localhost:3001** in your browser.

## Configuration

| Option | Default | How to set |
|--------|---------|------------|
| Port | `3001` | Set the `PORT` environment variable: `PORT=8080 ./start.sh` or `set PORT=8080 && start.bat` |

## Rust Server Setup

Make sure your Rust server is launched with WebRCON enabled:

```
+rcon.web 1 +rcon.port 28016 +rcon.password "YourPasswordHere"
```

The default RCON port is **28016**. The dashboard connects directly from the browser to your server via WebSocket — the Node.js backend only serves the static files and proxies Steam profile lookups.

## Project Structure

```
rustrcon/
├── start.sh           # Quick-start script (macOS/Linux)
├── start.bat          # Quick-start script (Windows)
├── backend/
│   ├── index.js       # Express server (static files + Steam API proxy)
│   └── package.json
└── frontend/
    ├── index.html     # Single-page dashboard (all HTML/CSS/JS)
    └── items.json     # Rust item database (1,193 items)
```

## How It Works

1. The Node.js backend serves the frontend files and provides a `/api/steam/:steamid` proxy endpoint for fetching Steam profiles (no API key needed).
2. Your browser connects **directly** to the Rust server's RCON WebSocket (`ws://host:port/password`).
3. All RCON commands and responses flow between your browser and the game server — the backend never sees your RCON password.

## Security Notes

- **RCON passwords** are stored in your browser's `localStorage` alongside saved servers. They never leave your machine or touch the backend server.
- **Steam profiles** are fetched server-side only because Steam's XML API doesn't support CORS. Only the SteamID64 is sent to the backend.
- For production/public deployments, consider putting the dashboard behind HTTPS and authentication (e.g., nginx + basic auth).

## License

[MIT](LICENSE)
