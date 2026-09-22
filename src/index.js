require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Validate critical environment variables
if (!process.env.DISCORD_TOKEN) {
  console.error('\n❌ FATAL: DISCORD_TOKEN is missing!');
  console.error('👉 Please copy .env.example to .env and insert your bot token from the Discord Developer Portal.\n');
  process.exit(1);
}

// Initialize client with required Gateway Intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // Privileged Intent required for welcome events
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.GuildMember, Partials.User]
});

// Setup command collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandList = require(filePath);
  if (Array.isArray(commandList)) {
    for (const cmd of commandList) {
      if ('data' in cmd && 'execute' in cmd) {
        client.commands.set(cmd.data.name, cmd);
      }
    }
  }
}

// Register event listeners
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Global Process Error Handlers to prevent unhandled crashing
process.on('unhandledRejection', error => {
  console.error('[Unhandled Promise Rejection]:', error);
});

process.on('uncaughtException', error => {
  console.error('[Uncaught Exception]:', error);
});

// Authenticate and start bot
client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('❌ Failed to login to Discord Gateway:', err.message);
  if (err.message.includes('disallowed intents')) {
    console.error('\n⚠️ ACTION REQUIRED: You must enable "SERVER MEMBERS INTENT" in the Discord Developer Portal:');
    console.error('1. Visit https://discord.com/developers/applications');
    console.log('2. Click your Bot -> "Bot" tab');
    console.log('3. Scroll down to "Privileged Gateway Intents"');
    console.log('4. Toggle ON "Server Members Intent" -> Save Changes\n');
  }
});
