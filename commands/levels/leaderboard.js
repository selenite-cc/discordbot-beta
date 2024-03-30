const { EmbedBuilder } = require("discord.js");
const { embedhex } = require("../../config.json");
const { SlashCommandBuilder } = require("discord.js");
const Sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');
const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "levels.sqlite",
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true
  }
});

// Define the old model with userID as BIGINT
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
  }
});

module.exports = {
  data: new SlashCommandBuilder().setName("leaderboard")
  .setDescription("vie wleaderboard.")
  .addIntegerOption((opt) => opt.setName("page").setDescription("amount of points to give").setRequired(false)),
  async execute(interaction) {
    try {
      let page = (interaction.options.getInteger("page") ?? 1) - 1;
      const leaderboard = await sequelize.query(`SELECT * FROM levels ORDER BY level DESC, points DESC LIMIT ${page * 10}, ${page * 10 + 10};`, { type: QueryTypes.SELECT });
      console.log(leaderboard);
      let levelEmbed = new EmbedBuilder()
      .setTitle("Leaderboard")
      for(let i = page*10; i < page*10+10; i++) {
        levelEmbed.addFields({ name: `${i+1}.`, value: `<@${leaderboard[i].userID}>: Level ${leaderboard[i].level}, and ${Math.round(leaderboard[i].points / leaderboard[i].level)}% of the way to the next level!` });
      }
      
      await interaction.reply({ embeds: [levelEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("There was an error. Please ping the owner if you see this.");
    }
  },
};