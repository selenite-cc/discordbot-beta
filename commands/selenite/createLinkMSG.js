const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("createlinkmsg").setDescription("dev command"),
  async execute(interaction) {
    if (interaction.isChatInputCommand() && interaction.channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageGuild)) {
      let linkEmbed = new EmbedBuilder().setTitle("Link").setDescription("Do you need a new link to Selenite? Click the button below to get a link sent right to your DMs.\nMake sure to enable DMs before clicking the button.");
      const link = new ButtonBuilder().setCustomId('link').setLabel('Get a link').setStyle(ButtonStyle.Primary);
      const button = new ActionRowBuilder().addComponents(link);
      await interaction.channel.send(
		    { embeds: [linkEmbed],
          components: [button],
        }
		  );
    }
  },
};
