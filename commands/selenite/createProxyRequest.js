const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder,  PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("createproxyrequest").setDescription("dev command"),
  async execute(interaction) {
    if (interaction.isChatInputCommand() && interaction.channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.Administrator)) {
      let linkEmbed = new EmbedBuilder().setTitle("Proxy").setDescription("Do you need a proxy link?? Click the button below to begin a request.\nMake sure to enable DMs before clicking the button, as your link and password will be sent via DMS.");
      const link = new ButtonBuilder().setCustomId('proxy_makeRequest').setLabel('Make a request').setStyle(ButtonStyle.Primary);
      const button = new ActionRowBuilder().addComponents(link);
      await interaction.channel.send(
		    { embeds: [linkEmbed],
          components: [button],
        }
		  );
    }
  },
};
