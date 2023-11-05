const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge messages.")
    .addIntegerOption((opt) => opt.setName("amount").setDescription("Amount of messages to delete").setRequired(true)),
  async execute(interaction) {
    try {
      if (!interaction.channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageMessages)) {
        await interaction.reply({ content: "You do not have the correct permissions.", ephemeral: true });
        return;
      }
      interaction.channel.bulkDelete(interaction.options.getInteger("amount"));
      await interaction.reply({ content: `Purged ${interaction.options.getInteger("amount")} messages.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error", ephemeral: true });
    }
  },
};
