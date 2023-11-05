const { Events } = require('discord.js');
module.exports = {
	name: Events.MessageUpdate,
	async execute(oldmsg,newmsg) {
		console.log(`Message edited from ${oldmsg.author.tag}: ${oldmsg} - ${newmsg}`);
	},
};
