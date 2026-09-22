const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const storage = require('../utils/storage');
const { createWelcomeEmbed } = require('../utils/embeds');

module.exports = [
  // Command 1: /welcome-setup
  {
    data: new SlashCommandBuilder()
      .setName('welcome-setup')
      .setDescription('Configure server welcome channel and presentation settings.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addChannelOption(option =>
        option
          .setName('channel')
          .setDescription('The text channel where welcome cards will be sent')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('message')
          .setDescription('Custom welcome text. Use {user}, {username}, {server}, {memberCount}')
          .setRequired(false)
      )
      .addStringOption(option =>
        option
          .setName('hex-color')
          .setDescription('Hex color code for embed border (e.g. #38bdf8 or #6366f1)')
          .setRequired(false)
      )
      .addBooleanOption(option =>
        option
          .setName('enable-dm')
          .setDescription('Send a direct message greeting to newly joined members')
          .setRequired(false)
      )
      .addBooleanOption(option =>
        option
          .setName('anti-raid-alert')
          .setDescription('Show warning badge if account is less than 7 days old')
          .setRequired(false)
      ),

    async execute(interaction) {
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      const hexColor = interaction.options.getString('hex-color');
      const enableDm = interaction.options.getBoolean('enable-dm');
      const antiRaidAlert = interaction.options.getBoolean('anti-raid-alert');

      const updates = {
        welcomeChannelId: channel.id
      };

      if (message !== null) updates.welcomeMessage = message;
      if (hexColor !== null) {
        if (/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
          updates.embedColor = hexColor;
        } else {
          return interaction.reply({
            content: '❌ Invalid HEX color format. Please provide a standard 6-digit hex code like `#38bdf8`.',
            ephemeral: true
          });
        }
      }
      if (enableDm !== null) updates.enableDmWelcome = enableDm;
      if (antiRaidAlert !== null) updates.antiRaidAlert = antiRaidAlert;

      const newConfig = storage.set(interaction.guildId, updates);

      await interaction.reply({
        content: `✅ **Welcome System Configured Successfully!**\n\n` +
          `• **Channel:** <#${newConfig.welcomeChannelId}>\n` +
          `• **Embed Color:** \`${newConfig.embedColor}\`\n` +
          `• **DM Greetings:** ${newConfig.enableDmWelcome ? 'Enabled' : 'Disabled'}\n` +
          `• **Anti-Raid Alert:** ${newConfig.antiRaidAlert ? 'Enabled' : 'Disabled'}\n` +
          `• **Message Preview:** ${newConfig.welcomeMessage}\n\n` +
          `💡 *Tip: Test this configuration right away by running \`/welcome-test\`!*`,
        ephemeral: true
      });
    }
  },

  // Command 2: /welcome-test
  {
    data: new SlashCommandBuilder()
      .setName('welcome-test')
      .setDescription('Simulate a member join event to test the welcome embed and buttons.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
      const config = storage.get(interaction.guildId);

      if (!config.welcomeChannelId) {
        return interaction.reply({
          content: '⚠️ No welcome channel configured yet! Please run `/welcome-setup` first.',
          ephemeral: true
        });
      }

      const targetChannel = interaction.guild.channels.cache.get(config.welcomeChannelId);
      if (!targetChannel) {
        return interaction.reply({
          content: '❌ The configured welcome channel could not be found. Please update it with `/welcome-setup`.',
          ephemeral: true
        });
      }

      // Build embed using the invoking user as the test subject
      const { embed, components } = createWelcomeEmbed(interaction.member, config);

      await targetChannel.send({
        content: `*(Test Simulation triggered by <@${interaction.user.id}>)*`,
        embeds: [embed],
        components: components
      });

      await interaction.reply({
        content: `🎯 **Test Welcome Dispatched!** Check <#${config.welcomeChannelId}> to see how it renders.`,
        ephemeral: true
      });
    }
  }
];
