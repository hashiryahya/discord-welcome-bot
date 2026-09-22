const storage = require('../utils/storage');
const { createGoodbyeEmbed } = require('../utils/embeds');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    try {
      const config = storage.get(member.guild.id);

      // Only dispatch goodbye if a channel is configured
      const channelId = config.goodbyeChannelId || config.welcomeChannelId;
      if (!channelId) return;

      const channel = member.guild.channels.cache.get(channelId);
      if (channel && channel.isTextBased()) {
        const goodbyeEmbed = createGoodbyeEmbed(member, config);
        await channel.send({ embeds: [goodbyeEmbed] });
      }
    } catch (error) {
      console.error(`[guildMemberRemove] Error handling departure of ${member.user?.tag || member.id}:`, error);
    }
  }
};
