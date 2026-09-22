const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'guild-configs.json');

// Default template for every server/guild
const DEFAULT_GUILD_CONFIG = {
  welcomeChannelId: null,
  goodbyeChannelId: null,
  autoRoleId: null,
  verificationRoleId: null,
  enableVerificationButton: true,
  enableDmWelcome: false,
  welcomeMessage: "Welcome to **{server}**, {user}! We're thrilled to have you here.",
  goodbyeMessage: "**{username}** has departed from **{server}**. We now have **{memberCount}** members.",
  dmMessage: "Hey {username}! Welcome to **{server}**. Make sure to read the rules and introduce yourself!",
  embedColor: "#38bdf8",
  antiRaidAlert: true // Warns if account is less than 7 days old
};

class StorageManager {
  constructor() {
    this.configs = new Map();
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const rawData = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(rawData);
        for (const [guildId, config] of Object.entries(parsed)) {
          this.configs.set(guildId, { ...DEFAULT_GUILD_CONFIG, ...config });
        }
      }
    } catch (err) {
      console.error('[StorageManager] Error initializing storage:', err);
    }
  }

  save() {
    try {
      const obj = Object.fromEntries(this.configs.entries());
      fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      console.error('[StorageManager] Error saving configs to disk:', err);
    }
  }

  get(guildId) {
    if (!this.configs.has(guildId)) {
      this.configs.set(guildId, { ...DEFAULT_GUILD_CONFIG });
      this.save();
    }
    return this.configs.get(guildId);
  }

  set(guildId, updates) {
    const current = this.get(guildId);
    const updated = { ...current, ...updates };
    this.configs.set(guildId, updated);
    this.save();
    return updated;
  }
}

module.exports = new StorageManager();
