const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Replace placeholders in template strings:
 * {user} -> <@id>
 * {username} -> username
 * {server} -> Guild name
 * {memberCount} -> Guild member count
 */
function formatTemplate(text, member) {
  if (!text) return '';
  return text
    .replace(/{user}/g, `<@${member.id}>`)
    .replace(/{username}/g, member.user?.username || member.displayName || 'Member')
    .replace(/{server}/g, member.guild.name)
    .replace(/{memberCount}/g, member.guild.memberCount.toString());
}

/**
 * Creates the primary Welcome Embed
 */
function createWelcomeEmbed(member, config) {
  const accountAgeDays = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24));
  const isBrandNewAccount = accountAgeDays < 7;

  const description = formatTemplate(config.welcomeMessage, member);

  const embed = new EmbedBuilder()
    .setColor(config.embedColor || '#38bdf8')
    .setAuthor({
      name: `Welcome to ${member.guild.name}!`,
      iconURL: member.guild.iconURL({ dynamic: true }) || undefined
    })
    .setTitle(`🎉 Welcome ${member.user.username}!`)
    .setDescription(description)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .addFields(
      {
        name: '👤 Member Info',
        value: `**Mention:** <@${member.id}>\n**User ID:** \`${member.id}\`\n**Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        inline: true
      },
      {
        name: '📈 Server Stats',
        value: `**Member Position:** #${member.guild.memberCount}\n**Total Members:** ${member.guild.memberCount}`,
        inline: true
      }
    )
    .setTimestamp()
    .setFooter({
      text: `${member.guild.name} Security & Welcome Bot`,
      iconURL: member.guild.iconURL({ dynamic: true }) || undefined
    });

  // Anti-raid / new account detection warning banner
  if (config.antiRaidAlert && isBrandNewAccount) {
    embed.addFields({
      name: '⚠️ Security Notice',
      value: `This account was registered only **${accountAgeDays} days ago**. Please follow server safety rules.`
    });
  }

  // Verification button row if enabled
  let components = [];
  if (config.enableVerificationButton && config.verificationRoleId) {
    const verifyButton = new ButtonBuilder()
      .setCustomId('btn_verify_member')
      .setLabel('Verify & Get Role')
      .setStyle(ButtonStyle.Success)
      .setEmoji('🛡️');

    const rulesButton = new ButtonBuilder()
      .setLabel('Server Guidelines')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/terms');

    components.push(new ActionRowBuilder().addComponents(verifyButton, rulesButton));
  }

  return { embed, components };
}

/**
 * Creates Goodbye / Leave Embed
 */
function createGoodbyeEmbed(member, config) {
  const description = formatTemplate(config.goodbyeMessage, member);

  return new EmbedBuilder()
    .setColor('#f43f5e')
    .setAuthor({
      name: 'Member Departed',
      iconURL: member.guild.iconURL({ dynamic: true }) || undefined
    })
    .setDescription(description)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .addFields(
      {
        name: 'Member Details',
        value: `**User:** ${member.user.tag}\n**ID:** \`${member.id}\``,
        inline: true
      },
      {
        name: 'Remaining Count',
        value: `**${member.guild.memberCount} members** left in ${member.guild.name}`,
        inline: true
      }
    )
    .setTimestamp()
    .setFooter({ text: `${member.guild.name}` });
}

module.exports = {
  formatTemplate,
  createWelcomeEmbed,
  createGoodbyeEmbed
};
