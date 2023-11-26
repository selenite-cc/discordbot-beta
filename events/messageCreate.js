const { Events } = require("discord.js");
const { widgets } = require("../config.json");
const profanity = require("@2toad/profanity").profanity;
const BadWordsNext = require("bad-words-next");
const en = require("bad-words-next/data/en.json");
const Sequelize = require("sequelize");
const badwords = new BadWordsNext();
const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "levels.sqlite",
});
const Levels = sequelize.define("levels", {
  userID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  level: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  lastMessage: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});
let reward = {
  "9999": "1"
}
module.exports = {
  name: Events.MessageCreate,
  async execute(interaction) {
    if (interaction.channelId == widgets) {
      if (profanity.exists(interaction.content) || badwords.check(interaction.content)) {
        interaction.delete();
      }
    }
    if (!interaction.author.bot) {
      try {
        let [level, created] = await Levels.findOrCreate({
          where: { userID: interaction.author.id },
          defaults: { level: 1, points: 1, lastMessage: 1 },
        });

        if (!created) {
          if (level.lastMessage + Math.round(Math.random() * (30 - 10) + 10) <= Math.floor(Date.now() / 1000)) {
            points = level.points + Math.round(Math.random() * (15 - 5) + 5);
            await Levels.update({ points: points, lastMessage: Math.floor(Date.now() / 1000) }, { where: { userID: interaction.author.id } });

            if (points >= 100 * level.level) {
              interaction.reply(`You have leveled up to level ${level.level + 1}!`);
              if(reward[level.level + 1]) {
                let rewardRole = interaction.guild.roles.cache.get(reward[level.level + 1]);
                interaction.guild.members.cache.get(interaction.author.id).roles.add(rewardRole).catch(console.error);
              }
              await Levels.update({ level: level.level + 1, points: 0, lastMessage: Math.floor(Date.now() / 1000) }, { where: { userID: interaction.author.id } });
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    console.log(`New Message by ${interaction.author.tag}: ${interaction.content}`);
  },
};
