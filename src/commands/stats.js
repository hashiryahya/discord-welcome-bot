const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('bot-status')
      .setDescription('Display bot health, latency, uptime, and system performance metrics.'),

    async execute(interaction) {
      const client = interaction.client;
      const uptimeMs = client.uptime;
      const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
      const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);

      const memoryUsageMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const apiPing = Math.round(client.ws.ping);

      const embed = new EmbedBuilder()
        .setColor('#38bdf8')
        .setTitle('⚡ Sentinel Welcome Bot - System Metrics')
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          {
            name: '📡 Latency',
            value: `• **WebSocket Ping:** \`${apiPing} ms\`\n• **Gateway:** \`Connected (Online)\``,
            inline: true
          },
          {
            name: '⏱️ Uptime',
            value: `\`${hours}h ${minutes}m ${seconds}s\``,
            inline: true
          },
          {
            name: '💾 Memory Heap',
            value: `\`${memoryUsageMb} MB\``,
            inline: true
          },
          {
            name: '🌐 Scale & Coverage',
            value: `• **Servers (Guilds):** \`${client.guilds.cache.size}\`\n• **Cached Users:** \`${client.users.cache.size}\``,
            inline: true
          },
          {
            name: '⚙️ Runtime Environment',
            value: `• **Node.js:** \`${process.version}\`\n• **Discord.js:** \`v14.18.0\``,
            inline: true
          },
          {
            name: '👨‍💻 Developer',
            value: `**Hashir Yahya**\n[GitHub Profile](https://github.com/hashiryahya)`,
            inline: true
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Designed for high reliability & zero downtime' });

      await interaction.reply({ embeds: [embed] });
    }
  }
];
