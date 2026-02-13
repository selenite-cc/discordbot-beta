const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { embedhex } = require("../../config.json");
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
  data: new SlashCommandBuilder().setName("addlevel").setDescription("Set a user's level.")
  .addUserOption((opt) => opt.setName("user").setDescription("User to change level of").setRequired(true))
  .addIntegerOption((opt) => opt.setName("level").setDescription("set level").setRequired(true))
  .addIntegerOption((opt) => opt.setName("points").setDescription("amount of points to give").setRequired(false)),
  async execute(interaction) {
    try {
      if (!interaction.channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageGuild)) {
        await interaction.reply({ content: "You do not have the correct permissions.", ephemeral: true });
        return;
      }
      let [level, created] = await Levels.findOrCreate({
        where: { userID: interaction.user.id },
        defaults: { level: 1, points: 0 },
      });
      await Levels.update({ level: interaction.options.getInteger('level'), points: interaction.options.getInteger('points') ?? 0 }, { where: { userID: interaction.options.getUser('user').id } });
      await interaction.reply({ content: `Set ${interaction.options.getUser('user').tag}'s level to ${interaction.options.getInteger('level')}, and points to ${interaction.options.getInteger('points') ?? 0}.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error", ephemeral: true });
    }
  },
};
