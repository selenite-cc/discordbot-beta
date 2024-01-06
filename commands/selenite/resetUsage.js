const { dispenser_logs } = require("../../config.json");
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
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("resetusage").setDescription("dev command")
	.addUserOption((option) => option.setName('user').setDescription("user").setRequired(true)),
	async execute(interaction) {
		if (interaction.isChatInputCommand() && interaction.channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.Administrator)) {
			let user = interaction.options.getUser('user');
			let [userData, firstGen] = await link.findOrCreate({
                where: { userID: user.id },
                defaults: { number: 0, firstGen: 0 },
              });
			  await link.update({ number: 0, firstGen: 0 }, { where: { userID: user.id } });
              await interaction.reply(`Reset usage for ${user.tag}`);
              const dispenserLogs = interaction.client.channels.cache.get(dispenser_logs.toString());
              dispenserLogs.send(`User ${user.id} - ${user.tag} had their usage reset.`);
		}
	},
};
