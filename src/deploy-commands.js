require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandList = require(filePath);
  if (Array.isArray(commandList)) {
    for (const cmd of commandList) {
      if ('data' in cmd && 'execute' in cmd) {
        commands.push(cmd.data.toJSON());
      }
    }
  }
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  console.error('❌ ERROR: DISCORD_TOKEN and CLIENT_ID are required in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`📡 Started refreshing ${commands.length} application (/) commands...`);

    if (guildId && guildId.trim() !== '') {
      // Register for specific development guild (instant update)
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`✅ Successfully reloaded ${data.length} commands for development guild: ${guildId}`);
    } else {
      // Register globally across all guilds (may take up to 1 hour on Discord edge caches)
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      console.log(`✅ Successfully reloaded ${data.length} application (/) commands globally.`);
    }
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }
})();
