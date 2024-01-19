const { Events } = require("discord.js");
const https = require("https");
const fs = require("fs");
const { logs_channel } = require("../config.json");

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(interaction) {
		console.log(interaction.user.id + " joined the server.");
		const { mtimeMs } = fs.statSync("leakers.json");
		if (Date.now() - mtimeMs > 43200000) {
			const url = "https://raw.githubusercontent.com/fidind3211/LinkGuard/master/Leakers.md";

			https.get(url, (res) => {
				let data = ""; // Collect the response data
				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					leakers = [];
					data
						.split("\n")
						.filter((e) => e.startsWith("<@!"))
						.forEach((line) => {
							leakers.push(line.split(" | ")[0].substring(3).slice(0, -1));
						});

					const path = "leakers.json";
					fs.writeFileSync(path, JSON.stringify(leakers));
				});
			});
		}
		let leakers = fs.readFileSync("leakers.json", { encoding: "utf8", flag: "r" });
		leakers = JSON.parse(leakers);
		if (leakers.includes(interaction.user.id)) {
			const leak = interaction.guild.members.cache.get(interaction.user.id);
			let leakerRole = interaction.guild.roles.cache.find((role) => role.name === "link leakers");
			leak.roles.add(leakerRole);
			const logsChannel = interaction.client.channels.cache.get(logs_channel.toString());
			await logsChannel.send(`Known link leaker ${interaction.user.tag} joined the server.`);
		}
	},
};
