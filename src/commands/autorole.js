const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const storage = require('../utils/storage');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('autorole-setup')
      .setDescription('Configure automatic roles given on join or upon button verification.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .addRoleOption(option =>
        option
          .setName('join-role')
          .setDescription('Role assigned immediately when a member joins the server')
          .setRequired(false)
      )
      .addRoleOption(option =>
        option
          .setName('verify-role')
          .setDescription('Role assigned when clicking the "Verify & Get Role" button on the welcome card')
          .setRequired(false)
      )
      .addBooleanOption(option =>
        option
          .setName('enable-verify-button')
          .setDescription('Display the interactive Verify button on welcome embeds')
          .setRequired(false)
      ),

    async execute(interaction) {
      const joinRole = interaction.options.getRole('join-role');
      const verifyRole = interaction.options.getRole('verify-role');
      const enableButton = interaction.options.getBoolean('enable-verify-button');

      const updates = {};
      if (joinRole !== null) updates.autoRoleId = joinRole.id;
      if (verifyRole !== null) updates.verificationRoleId = verifyRole.id;
      if (enableButton !== null) updates.enableVerificationButton = enableButton;

      if (Object.keys(updates).length === 0) {
        const current = storage.get(interaction.guildId);
        return interaction.reply({
          content: `ℹ️ **Current Auto-Role Configuration:**\n\n` +
            `• **Immediate Join Role:** ${current.autoRoleId ? `<@&${current.autoRoleId}>` : '*None*'}\n` +
            `• **Verification Button Role:** ${current.verificationRoleId ? `<@&${current.verificationRoleId}>` : '*None*'}\n` +
            `• **Verification Button Visible:** ${current.enableVerificationButton ? 'Yes' : 'No'}\n\n` +
            `*To change these settings, re-run this command with options specified.*`,
          ephemeral: true
        });
      }

      // Check bot permissions against selected roles
      const botMember = interaction.guild.members.me;
      const checkedRoles = [joinRole, verifyRole].filter(Boolean);
      for (const r of checkedRoles) {
        if (botMember.roles.highest.position <= r.position) {
          return interaction.reply({
            content: `⚠️ **Role Hierarchy Warning:** The bot's highest role is lower than or equal to <@&${r.id}>. Move the bot's role above this role in Server Settings -> Roles, or role assignment will fail.`,
            ephemeral: true
          });
        }
      }

      const newConfig = storage.set(interaction.guildId, updates);

      await interaction.reply({
        content: `✅ **Auto-Role Settings Updated!**\n\n` +
          `• **Immediate Join Role:** ${newConfig.autoRoleId ? `<@&${newConfig.autoRoleId}>` : '*None*'}\n` +
          `• **Verification Role:** ${newConfig.verificationRoleId ? `<@&${newConfig.verificationRoleId}>` : '*None*'}\n` +
          `• **Verification Button Enabled:** ${newConfig.enableVerificationButton ? 'Yes' : 'No'}`,
        ephemeral: true
      });
    }
  }
];
