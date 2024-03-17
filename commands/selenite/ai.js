const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { ai_key, logs_channel } = require("../../config.json");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("ai")
	.setDescription("ai")
	.addStringOption((opt) => opt.setName("prompt").setDescription("prompt").setRequired(true)),
	async execute(interaction) {
		await interaction.reply("Go to #ai")
	},
};
