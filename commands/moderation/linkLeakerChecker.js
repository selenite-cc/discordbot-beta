const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { logs_channel } = require("../../config.json");
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder().setName("linkleakerchecker").setDescription("Checks if a user is a known link leaker"),
	async execute(interaction) {
		try {
			if (!interaction.channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageRoles)) {
				await interaction.reply({ content: "You do not have the correct permissions.", ephemeral: true });
				return;
			}
			const client = interaction.client;
			let members = await interaction.guild.members.fetch();
			const { mtimeMs } = fs.statSync("leakers.json");
			if (Date.now() - mtimeMs > 43200000) {
				const url = "https://leakersapi.rare1k.dev/ids";

				https.get(url, (res) => {
					const path = "leakers.json";
					const writeStream = fs.createWriteStream(path);

					res.pipe(writeStream);

					writeStream.on("finish", () => {
						writeStream.close();
					});
				});
			}
			let leakers = fs.readFileSync("leakers.json", { encoding: "utf8", flag: "r" });
			leakers = JSON.parse(leakers);
      let foundLeakers = [];
      for (let i = 0; i < leakers.length; i++) {
        foundLeakers.push([leakers[i], false, false]);
      }
      members.forEach((member) => {
        if (leakers.includes(member.user.id)) {
          foundLeakers[leakers.indexOf(member.user.id)][1] = true;
          if(!member.roles.cache.some(role => role.name === 'link leakers')) {
            foundLeakers[leakers.indexOf(member.user.id)][2] = true;
            const leak = interaction.guild.members.cache.get(member.user.id);
            let leakerRole = interaction.guild.roles.cache.find((role) => role.name === "link leakers");
            leak.roles.add(leakerRole);
            const logsChannel = interaction.client.channels.cache.get(logs_channel.toString());
            logsChannel.send(`${member.user.tag} was detected as a link leaker.`);
          }
        }
			});
      let embedDesc = "Results:\nUser - Found - Role Added\n";
      for(let i = 0; i < foundLeakers.length; i++) {
        embedDesc += `<@${foundLeakers[i][0]}> - ${foundLeakers[i][1]} - ${foundLeakers[i][2]}\n`;
      }
      let leakEmbed = new EmbedBuilder().setTitle("Link Leakers").setDescription(embedDesc);
      await interaction.reply({ embeds: [leakEmbed] });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error", ephemeral: true });
		}
	},
};
