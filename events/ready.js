const { Events } = require('discord.js');
const { logs_channel } = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        const logsChannel = client.channels.cache.get(logs_channel.toString());
        if (logsChannel) {
            logsChannel.send(`Ready! Logged in as ${client.user.tag}`);
        }
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
