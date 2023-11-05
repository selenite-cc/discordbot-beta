const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const { token, widgets, logs_channel } = require("./config.json");
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent"] });
const Sequelize = require("sequelize");
const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "levels.sqlite",
});
const Levels = sequelize.define("levels", {
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
let stati = [
  `watching yall be weird`,
  `donate to patreon plz`,
  `made by https://skysthelimit.dev`,
  `https://github.com/selenite-cc`
]
client.once(Events.ClientReady, () => {
  Levels.sync();
  setInterval(() => {
    client.user.setActivity(stati[Math.round(Math.random() * (stati.length - 1))], {type: 4});
  }, 60000)
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
  logsChannel.send(`Message edited from ${oldm.author.tag}: ${oldm} - ${newm}`);
});
