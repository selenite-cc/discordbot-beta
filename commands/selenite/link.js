const { SlashCommandBuilder } = require("discord.js");
const { links, dispenser_logs } = require("../../config.json");
const Sequelize = require("sequelize");
const lnk = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "linkbot.sqlite",
});
const link = lnk.define("links", {
  userID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  number: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  firstGen: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});
module.exports = {
  data: new SlashCommandBuilder().setName("link").setDescription("Get a new link to Selenite."),
  async execute(interaction) {
    let [userData, firstGen] = await link.findOrCreate({
      where: { userID: interaction.user.id },
      defaults: { number: 0, firstGen: 0 },
    });
    if (userData.firstGen + 3600 < Math.floor(Date.now() / 1000)) {
      await userData.update({ number: 0, firstGen: 0 }, { where: { userID: interaction.user.id } });
    } else if (userData.number == 2) {
      console.log(userData.number);
      await interaction.reply({ content: `Please wait, you can generate 2 new links <t:${userData.firstGen + 3600}:R>.`, ephemeral: true });
      return;
    }
    let userLink = links[Math.floor(Math.random() * links.length)];
    await interaction.user.send({ content: `**Please do not share links publically.**\nYour link is <${userLink}>` });
    const dispenserLogs = interaction.client.channels.cache.get(dispenser_logs.toString());
    dispenserLogs.send(`User ${interaction.user.id} - ${interaction.user.tag} generated a new link: <${userLink}>`);
    if (userData.number == 0) {
      await link.update({ number: 1, firstGen: Math.floor(Date.now() / 1000) }, { where: { userID: interaction.user.id } });
    } else {
      await link.update({ number: 2 }, { where: { userID: interaction.user.id } });
    }
  },
};
