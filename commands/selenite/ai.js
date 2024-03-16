const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { ai_key } = require("../../config.json");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("ai")
	.setDescription("ai")
	.addStringOption((opt) => opt.setName("prompt").setDescription("prompt").setRequired(true)),
	async execute(interaction) {
		try {
			const genAI = new GoogleGenerativeAI(ai_key);
			const model = genAI.getGenerativeModel({ model: "gemini-pro"});
			console.log(interaction.options.getString("prompt"));
			await interaction.reply({ content: "Generating response..", ephemeral: true });
			const result = await model.generateContent("You are an AI model called Selenite GPT. Selenite is an unblocked games website, available at https://selenite.cc, which you have been trained for. You may be called Selenite, or Selenite GPT. You have been trained by the Selenite dev team. The following is the prompt:\n" + interaction.options.getString("prompt"));
			const response = await result.response;
			const text = response.text();
			console.log(text);
			let linkEmbed = new EmbedBuilder()
			.setTitle("Selenite GPT")
			.setDescription(text)
			.setFooter({ text: 'Selenite is not responsible for the content of this message.' });
			// await interaction.reply({ embeds: [linkEmbed] });
			await interaction.channel.send({ embeds: [linkEmbed] });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error", ephemeral: true });
		}
	},
};
