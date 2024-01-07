const { EmbedBuilder } = require("discord.js");
const { embedhex } = require("../../config.json");
const { SlashCommandBuilder } = require("discord.js");
const Sequelize = require("sequelize");
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
module.exports = {
  data: new SlashCommandBuilder().setName("level")
  .setDescription("View your current level."),
  async execute(interaction) {
    try {
      let [level, created] = await Levels.findOrCreate({
        where: { userID: interaction.user.id },
        defaults: { level: 1, points: 0 },
      });
      let levelEmbed = new EmbedBuilder()
      .setDescription(`> **Level:** ${level.level}\n> **Progress:** ${Math.floor(((level.points) / (level.level * 100)) * 100)}% to level ${level.level + 1}!`)
      .setColor("#49ba67");
      
      await interaction.reply({ embeds: [levelEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("There was an error. Please ping the owner if you see this.");
    }
  },
};