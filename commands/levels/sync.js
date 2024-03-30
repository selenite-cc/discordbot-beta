const { EmbedBuilder } = require("discord.js");
const { embedhex } = require("../../config.json");
const { SlashCommandBuilder } = require("discord.js");
const Sequelize = require("sequelize");
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
module.exports = {
  data: new SlashCommandBuilder().setName("sync")
  .setDescription("sync level rewards."),
  async execute(interaction) {
    try {
      let [level, created] = await Levels.findOrCreate({
        where: { userID: interaction.user.id },
        defaults: { level: 1, points: 0 },
      });
      console.log(level.level);
      let rewards = [];
      for (let rewardLevel in reward) {
        if (level.level >= rewardLevel) {
          rewards.push(reward[rewardLevel]);
        }
      }
      if(rewards.length > 0) {
        for(let i = 0;i<rewards.length;i++) {
          interaction.guild.members.cache.get(interaction.user.id).roles.add(rewards[i]).catch(console.error);
        }
      }
      console.log("Rewards the user can get: ", rewards);
      await interaction.reply(`Added ${rewards.length} roles.`)
    } catch (error) {
      console.error(error);
      await interaction.reply("There was an error. Please ping the owner if you see this.");
    }
  },
};