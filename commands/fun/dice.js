const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { runAI } = require("../../utils")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a 6-sided dice!"),
  async execute(interaction) {
    try {
      const result = Math.floor(Math.random() * 6) + 1;

      let rollEmbed = new EmbedBuilder()
        .setTitle(`🎲 **${result}**`)
        .setColor("#0099ff")

      await interaction.reply({ embeds: [rollEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("There was an error. Please ping the owner if you see this.");
    }
  },
};
