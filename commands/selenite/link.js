const { SlashCommandBuilder } = require("discord.js");
const { links } = require("../../config.json");
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
  }
});
module.exports = {
  data: new SlashCommandBuilder().setName("link").setDescription("Get a new link to Selenite."),
  async execute(interaction) {
		let [number, firstGen] = await link.findOrCreate({
			where: { userID: interaction.user.id },
			defaults: { number: 0, firstGen: 0 },
		  });
		if(number.firstGen + 3600 < Math.floor(Date.now() / 1000)) {
			await link.update({ number: 0, firstGen: 0 }, { where: { userID: interaction.user.id } });
		}
		if(number.number > 1) {
			await interaction.reply({ content: `Please wait, you can generate 2 new links <t:${number.firstGen + 3600}:R>.`, ephemeral: true });
			return;
		}
      await interaction.user.send({ content: `**Please do not share links publically.**\nYour link is ${links[Math.floor(Math.random() * links.length)]}` });
	  if(number.number == 0) {
		await link.update({ number: 1, firstGen: Math.floor(Date.now() / 1000) }, { where: { userID: interaction.user.id } });
	  } else {
		await link.update({ number: 2 }, { where: { userID: interaction.user.id } });
	  }
	  
  },
};
