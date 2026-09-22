const storage = require('../utils/storage');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // 1. Handle Slash Command interactions
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({
          content: '❌ Unrecognized slash command.',
          ephemeral: true
        });
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`[Command Error: /${interaction.commandName}]`, error);
        const replyPayload = {
          content: '⚠️ An unexpected error occurred while executing this command.',
          ephemeral: true
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(replyPayload);
        } else {
          await interaction.reply(replyPayload);
        }
      }
      return;
    }

    // 2. Handle Button click interactions (Verification button)
    if (interaction.isButton()) {
      if (interaction.customId === 'btn_verify_member') {
        const config = storage.get(interaction.guildId);

        if (!config.verificationRoleId) {
          return interaction.reply({
            content: '⚠️ The verification role has not been set by server administrators yet.',
            ephemeral: true
          });
        }

        const role = interaction.guild.roles.cache.get(config.verificationRoleId);
        if (!role) {
          return interaction.reply({
            content: '❌ Configured verification role not found. Please contact an admin.',
            ephemeral: true
          });
        }

        // Check if member already has the role
        if (interaction.member.roles.cache.has(role.id)) {
          return interaction.reply({
            content: `🛡️ You already have the **${role.name}** role and full access to the server!`,
            ephemeral: true
          });
        }

        try {
          await interaction.member.roles.add(role);
          await interaction.reply({
            content: `🎉 **Verification Complete!** You have been granted the **${role.name}** role. Enjoy your stay in **${interaction.guild.name}**!`,
            ephemeral: true
          });
        } catch (err) {
          console.error('[Verification Error]', err);
          await interaction.reply({
            content: `⚠️ Failed to assign role. Make sure the bot's role is positioned higher than the **${role.name}** role in server settings.`,
            ephemeral: true
          });
        }
      }
    }
  }
};
