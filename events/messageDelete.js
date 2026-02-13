const { Events } = require('discord.js');
module.exports = {
	name: Events.MessageDelete,
	async execute(interaction) {
		console.log(`Message deleted from ${interaction.author.tag}: ${interaction.content}`);
	},
};
