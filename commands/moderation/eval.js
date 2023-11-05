const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate JavaScript Expressions")
    .addStringOption((opt) => opt.setName("expression").setDescription("Expression to evaluate").setRequired(true)),
  async execute(interaction) {
    try {
        expression = eval(interaction.options.getString("expression"));
        if(!isNaN(expression)) expression = expression.toString();
        await interaction.reply({ content: expression });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error", ephemeral: true });
    }
  },
};
