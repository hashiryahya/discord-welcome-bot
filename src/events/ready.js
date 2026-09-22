const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`=========================================`);
    console.log(`🚀 [SENTINEL BOT] Logged in as: ${client.user.tag}`);
    console.log(`🛡️  Monitoring ${client.guilds.cache.size} server(s)`);
    console.log(`⚡ Node.js version: ${process.version}`);
    console.log(`=========================================`);

    // Dynamic rotation of presence activity
    const activities = [
      { name: 'new members join 👋', type: ActivityType.Watching },
      { name: '/welcome-setup | Sentinel', type: ActivityType.Playing },
      { name: 'server security & verification 🛡️', type: ActivityType.Custom }
    ];

    let index = 0;
    client.user.setPresence({
      activities: [activities[0]],
      status: 'online'
    });

    setInterval(() => {
      index = (index + 1) % activities.length;
      client.user.setPresence({
        activities: [activities[index]],
        status: 'online'
      });
    }, 60000);
  }
};
