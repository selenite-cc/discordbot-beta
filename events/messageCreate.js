const { Events } = require("discord.js");
const { widgets, logs_channel, links, ai_channel, freaky_ai_channel } = require("../config.json");
const profanity = require("@2toad/profanity").profanity;
const BadWordsNext = require("bad-words-next");
const en = require("bad-words-next/data/en.json");
const Sequelize = require("sequelize");
const badwords = new BadWordsNext();
const { runAI } = require("../utils.js");
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "levels.sqlite",
});
const Levels = sequelize.define("levels", {
  userID: {
    type: Sequelize.STRING,
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
  "1": "1223470895918481539",
  "3": "1223470930609832059",
  "5": "1223470948976558191",
  "10": "1223470964533231731",
  "15": "1223470982132535416",
  "20": "1223471004769058917",
  "30": "1223471022359969882",
  "40": "1223471048456929310",
  "50": "1223471066165411900"
}
module.exports = {
  name: Events.MessageCreate,
  async execute(interaction) {
    if (interaction.channelId == widgets) {
      let linkRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
      let ghostedRegex = /QJM9bSW/;
      if (profanity.exists(interaction.content) || badwords.check(interaction.content) || linkRegex.test(interaction.content) || ghostedRegex.test(interaction.content) || interaction.content.includes("trump") || interaction.content.includes("harris")) {
        interaction.delete();
        const logsChannel = interaction.client.channels.cache.get(logs_channel.toString());
        logsChannel.send(`Message in #widgets deleted by ${interaction.author.username}\nprofanity 1, profanity 2, link, linker doc\n${profanity.exists(interaction.content)} ${badwords.check(interaction.content)} ${linkRegex.test(interaction.content)} ${ghostedRegex.test(interaction.content)}`);
      } else if (profanity.exists(interaction.author.tag) || badwords.check(interaction.author.tag)) {
        msg = await interaction.reply("Please change your name.");
        interaction.delete();
        await sleep(5000);
        msg.delete();
        
      }
    }
    if (!interaction.author.bot) {
      if(interaction.channelId == ai_channel) {
        runAI(interaction, false);
      }
      if(interaction.channelId == freaky_ai_channel) {
        runAI(interaction, true);
      }
      for(let i = 0;i<links.length;i++) {
        if(interaction.content.includes(links[i].slice(8))) {
          msg = await interaction.reply("Please do not send links from the link bot.");
          interaction.delete();
          await sleep(5000);
          msg.delete();
        }
      }
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
