<div align="center">

# 🛡️ Sentinel | Advanced Discord Welcome & Verification Bot

**A production-ready, modular Discord bot built with Discord.js v14 featuring rich embed welcome cards, interactive button verification, anti-raid security detection, and slash commands.**

[![Discord.js](https://img.shields.io/badge/discord.js-v14.18.0-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained-Yes-green?style=for-the-badge)]()

[Features](#-features) • [Slash Commands](#-slash-commands) • [Installation](#-installation-guide) • [Discord Portal Setup](#-discord-developer-portal-configuration) • [Deployment](#-247-hosting--deployment)

</div>

---

## 🌟 Features

- 🎨 **Dynamic Welcome Embeds**: Generates welcome cards featuring user avatars, member join position (`#42`), server banners, and customizable accent HEX colors.
- 🛡️ **Interactive One-Click Verification**: Attach interactive `Verify & Get Role` buttons directly to welcome cards so newcomers can unlock channels without manual admin intervention.
- 🚨 **Anti-Raid & Alt Account Warnings**: Automatically flags accounts created less than 7 days ago to safeguard communities against raids and alts.
- 🎭 **Dual Auto-Role Engine**:
  - **Immediate Join Role**: Gives newcomers a guest/unverified role instantly upon entering.
  - **Verification Role**: Automatically promotes members upon completing the button verification prompt.
- 📩 **Direct Message Onboarding**: Optional direct message greeting with server guidelines, links, and FAQs.
- 🚪 **Member Departure Logging**: Clean goodbye cards tracking how long users stayed and remaining server headcount.
- 🧪 **Built-In Join Simulator (`/welcome-test`)**: Test and preview your welcome card and button interactions instantly without needing test accounts.
- 💾 **Zero-Dependency Persistent Storage**: Guild configurations automatically persist to lightweight JSON storage without complex database dependencies.

---

## ⚡ Slash Commands

| Command | Description | Permissions Required |
| :--- | :--- | :--- |
| `/welcome-setup` | Configure welcome channel, custom text, HEX embed color, DMs, and anti-raid flags. | `Manage Server` |
| `/welcome-test` | Simulates a welcome join event using your profile to preview embed visuals. | `Manage Server` |
| `/autorole-setup` | Configure immediate join roles and button verification roles. | `Manage Roles` |
| `/bot-status` | Inspect live WebSocket ping, uptime, RAM usage, and cached guild counts. | `@everyone` |

### Supported Variable Placeholders
When setting custom welcome or DM messages, you can use these dynamic tokens:
- `{user}` — Mentions the new member (`@Username`)
- `{username}` — Displays plain username (`Username`)
- `{server}` — Displays server name (`Community Name`)
- `{memberCount}` — Displays updated member count (`142`)

---

## 📁 Project Architecture

```
discord-welcome-bot/
├── src/
│   ├── commands/
│   │   ├── welcome.js         # /welcome-setup and /welcome-test
│   │   ├── autorole.js        # /autorole-setup
│   │   └── stats.js           # /bot-status
│   ├── events/
│   │   ├── ready.js               # Startup & dynamic rotating presence
│   │   ├── guildMemberAdd.js      # Join event, embed dispatch, auto-role, DM
│   │   ├── guildMemberRemove.js   # Departure logging
│   │   └── interactionCreate.js   # Slash commands & button handlers
│   ├── utils/
│   │   ├── embeds.js          # Standardized embed constructors
│   │   └── storage.js         # Persistent JSON configuration store
│   ├── deploy-commands.js     # Slash command registration script
│   └── index.js               # Client entry point & error isolation
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) `v18.0.0` or higher
- A Discord account and administrative permissions on a server

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/hashiryahya/discord-welcome-bot.git
cd discord-welcome-bot
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials in `.env`:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id_here
GUILD_ID=your_test_guild_id_here  # Optional: For instant command registration
```

### 3. Deploy Slash Commands
```bash
npm run deploy-commands
```

### 4. Launch the Bot
```bash
npm start
```

---

## 🔑 Discord Developer Portal Configuration

For the bot to detect member joins, you **MUST** enable Discord's Privileged Gateway Intents:

1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select or create your Application.
3. In the left navigation, click **Bot**.
4. Scroll down to **Privileged Gateway Intents**:
   - ✅ **Server Members Intent** (Required for join/leave events & roles)
   - ✅ **Presence Intent** (Recommended)
5. Under **Bot Permissions**, make sure it has:
   - `Send Messages`, `Embed Links`, `Manage Roles`, `View Channels`, `Use External Emojis`.
6. To invite the bot to your server:
   - Go to **OAuth2** -> **URL Generator**
   - Check `bot` and `applications.commands`
   - Select permissions: `Manage Roles`, `Send Messages`, `Embed Links`
   - Copy and open the generated invite link.

> ⚠️ **Role Hierarchy Tip**: In your Discord Server Settings -> **Roles**, drag the Bot's role **above** any role it needs to assign (e.g., above the `@Member` or `@Verified` role).

---

## 🌐 24/7 Hosting & Deployment

This bot is lightweight and can run permanently on free or low-cost cloud tiers:

### Option A: Railway / Render
1. Push this repository to your GitHub profile.
2. Link your GitHub repo to [Railway.app](https://railway.app) or [Render.com](https://render.com).
3. Set the start command: `npm start`.
4. Add your `DISCORD_TOKEN` and `CLIENT_ID` in the Environment Variables tab.

### Option B: Linux VPS (Ubuntu / Debian using PM2)
```bash
# Install PM2 process manager
sudo npm install -g pm2

# Start bot as a background service
pm2 start src/index.js --name "sentinel-bot"

# Enable auto-start on system boot
pm2 startup
pm2 save
```

---

## 👨‍💻 Author

**Hashir Yahya**  
- Portfolio: [hashiryahya.github.io](https://hashiryahya.github.io)  
- GitHub: [@hashiryahya](https://github.com/hashiryahya)  
- LinkedIn: [linkedin.com/in/hashiryahya](https://linkedin.com/in/hashiryahya)  
- Email: `hashiryahya6@gmail.com`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
