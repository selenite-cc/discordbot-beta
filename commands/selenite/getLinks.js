const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("links").setDescription("How to get links"),
  async execute(interaction) {
    if (interaction.isChatInputCommand() && interaction.channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageGuild)) {
      let linkEmbed = new EmbedBuilder().setTitle("Links").setDescription("You can get links by:\n1. Going to <#1193715279109300234> and verifying yourself.\n2. Going to <#1148723858157883495> or <#1451023261268836423> to find links.");
      await interaction.channel.send(
		    { embeds: [linkEmbed]
        }
		  );
    }
  },
};
