const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("createbyodembed").setDescription("dev command"),
  async execute(interaction) {
    if (interaction.isChatInputCommand() && interaction.channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageGuild)) {
      let byodEmbed = new EmbedBuilder().setTitle("Bring Your Own Domain").setDescription("Do you wish you could just create your own domain without the hassle of hosting it yourself?\n\nBring Your Own Domain allows you to simply create a domain using any service, point it to us, and we'll host it for you!");
      const link = new ButtonBuilder().setCustomId('byodA').setLabel('Click here to start!').setStyle(ButtonStyle.Primary);
      const button = new ActionRowBuilder().addComponents(link);
      await interaction.channel.send(
		    { embeds: [byodEmbed],
          components: [button],
        }
		  );
    }
  },
};
