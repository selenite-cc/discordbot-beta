const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const { token, widgets, logs_channel, links, dispenser_logs } = require("./config.json");
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent"], allowedMentions: { everyone: [false], roles: [false] } });
const Sequelize = require("sequelize");
const level = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "levels.sqlite",
});
const Levels = level.define("levels", {
	userID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	level: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
	points: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	lastMessage: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	createdAt: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
	},
	updatedAt: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
	},
});
const lnk = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "linkbot.sqlite",
});
const link = lnk.define("links", {
	userID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	number: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	firstGen: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});
let stati = [`👨‍💻 Working on Selenite.`, `👀 Watching the Selenite Discord`, `🎮 Playing on Selenite`, `https://github.com/selenite-cc/`, `https://selenite.cc/`];
client.once(Events.ClientReady, () => {
	Levels.sync();
	setInterval(() => {
		client.user.setActivity(stati[Math.round(Math.random() * (stati.length - 1))], { type: 4 });
	}, 60000);
});
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

client.on("messageDelete", (interaction) => {
	const logsChannel = client.channels.cache.get(logs_channel.toString());
	logsChannel.send(`Message deleted from ${interaction.author.tag}: ${interaction.content}`);
});
client.on("messageUpdate", (oldm, newm) => {
	const logsChannel = client.channels.cache.get(logs_channel.toString());
	if (!oldm == newm) {
		logsChannel.send(`Message edited from ${oldm.author.tag}: ${oldm} - ${newm}`);
	}
});
client.on("interactionCreate", async (interaction) => {
	if (interaction.isButton()) {
		if (interaction.customId === "link") {
			let [userData, firstGen] = await link.findOrCreate({
				where: { userID: interaction.user.id },
				defaults: { number: 0, firstGen: 0 },
			});
			if (userData.firstGen + 43200 < Math.floor(Date.now() / 1000)) {
				await userData.update({ number: 0, firstGen: 0 }, { where: { userID: interaction.user.id } });
			} else if (userData.number == 2) {
				console.log(userData.number);
				await interaction.reply({ content: `Please wait, you can generate 2 new links <t:${userData.firstGen + 43200}:R>.`, ephemeral: true });
				return;
			}
			try {
				let userLink = links[Math.floor(Math.random() * links.length)];
				await interaction.user.send({ content: `**Please do not share links publically.**\nYour link is <${userLink}>` });
				const dispenserLogs = client.channels.cache.get(dispenser_logs.toString());
				dispenserLogs.send(`User ${interaction.user.id} - ${interaction.user.tag} generated a new link: <${userLink}>`);
				if (userData.number == 0) {
					await link.update({ number: 1, firstGen: Math.floor(Date.now() / 1000) }, { where: { userID: interaction.user.id } });
				} else {
					await link.update({ number: 2 }, { where: { userID: interaction.user.id } });
				}
			} catch (error) {
				await interaction.reply({ content: `Please enable DMs.`, ephemeral: true });
				const dispenserLogs = client.channels.cache.get(dispenser_logs.toString());
				dispenserLogs.send(`User ${interaction.user.id} - ${interaction.user.tag} didn't enable dms :skull:`);
				return;
			}
		}
	}
});
