const storage = require('../utils/storage');
const { createWelcomeEmbed, formatTemplate } = require('../utils/embeds');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    try {
      const config = storage.get(member.guild.id);

      // 1. Assign Immediate Join Role if configured
      if (config.autoRoleId) {
        try {
          const role = member.guild.roles.cache.get(config.autoRoleId);
          if (role) {
            await member.roles.add(role);
            console.log(`[AutoRole] Assigned role "${role.name}" to @${member.user.tag}`);
          }
        } catch (err) {
          console.error(`[AutoRole] Failed to assign role to ${member.user.tag}:`, err.message);
        }
      }

      // 2. Dispatch Welcome Embed to configured channel
      if (config.welcomeChannelId) {
        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (channel && channel.isTextBased()) {
          const { embed, components } = createWelcomeEmbed(member, config);
          await channel.send({
            content: `Hey <@${member.id}>, welcome! 🎉`,
            embeds: [embed],
            components: components
          });
        }
      }

      // 3. Optional Direct Message greeting
      if (config.enableDmWelcome && config.dmMessage) {
        try {
          const dmText = formatTemplate(config.dmMessage, member);
          await member.send({
            content: dmText
          });
        } catch {
          // Member may have DMs disabled; ignore error safely
        }
      }
    } catch (error) {
      console.error(`[guildMemberAdd] Error processing new member ${member.user.tag}:`, error);
    }
  }
};
