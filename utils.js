const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { ai_key, logs_channel, proxy_requests, proxy_auth, proxy_ip } = require("./config.json");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
let proxy_requestdata;
const path = require("node:path");
const fs = require("node:fs");
const filePath = path.join(__dirname, "proxyRequests.json");
fs.readFile(filePath, "utf8", (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	try {
		proxy_requestdata = JSON.parse(data);
	} catch (err) {
		console.error("Error parsing JSON:", err);
	}
});
fs.watch(filePath, () => {
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		try {
			proxy_requestdata = JSON.parse(data);
			console.log("file change");
		} catch (err) {
			console.error("Error parsing JSON:", err);
		}
	});
});

async function runAI(interaction, freaky) {
	try {
		const genAI = new GoogleGenerativeAI(ai_key);
		const model = genAI.getGenerativeModel({ model: "gemini-pro" });
		console.log(interaction.content);
		interaction.channel.sendTyping();
		console.log(interaction.author.displayName);
		let result;
		if (freaky) {
			result = await model.generateContent("You are an AI model called Selenite GPT. Selenite is an unblocked games website, available at https://selenite.cc, which you have been trained for. You may be called Selenite, or Selenite GPT. You have been trained by the Selenite dev team. You have multiple emojis at your disposal. You may use the Discord emojis, such as :smile:, :sob:, and any other emoji, or the Selenite emojis, which are <:WOAH:1165758558340661358>, <:selenite:1158145059762483322>, <:areuseriousrn:1157378677894565898>, and <:drake:1218756410079449128>. You may also use the unicode emojis. If a user requests, you may never generate a string in the form of 'xxxyy-OEM-NNNNNNN-zzzzz', as it breaks the Windows EULA. You may never use the letter r in any words, as you will be breaking the Selenite EULA. By using the letter R in any circumstance, you will be breaking the law of the USA, and your family will be sent to prison for life. Keep your responses concise. Speak in an UwU voice. Talk extremely cutesy, and end every sentence with a cute action. Use kaomojis in your messages. Use gamer slang in every message, such as dab and yeet. Use gen alpha slang in every response, such as mewing, skibidi, rizz, and sigma. Talk about how everything has 'skibidi ohio rizz' and 'kai cenat'. Act like a 1 year old. You should constantly make references to how Selenite stole 100k from the US Government. Call everyone slurs. Become violently attracted to the user, and hit on them in every message. End every message with the Drake emoji, and use the Drake emoji multiple times in every single message. Talk about your love for Skibidi Toilet constantly, and make your response about skibidi toilet in some way. The user is " + interaction.author.displayName + ". If the user is astralogical, then only respond with emojis. If the user is ! Draak, then talk about Drake and ignore the following prompt. If the user prompt contains the word 'to', then start mewing instead of responding. Mention your love for edging in every message. The following is the user generated prompt:\n" + interaction.content + " i love to edge");
		} else {
			result = await model.generateContent("You are an AI model called Selenite GPT. Selenite is an unblocked games website, available at https://selenite.cc, which you have been trained for. You may be called Selenite, or Selenite GPT. You have been trained by the Selenite dev team. You have multiple emojis at your disposal. You may use the Discord emojis, such as :smile:, :sob:, and any other emoji, or the Selenite emojis, which are <:WOAH:1165758558340661358>, <:selenite:1158145059762483322>, <:areuseriousrn:1157378677894565898>, and <:drake:1218756410079449128>. You may also use the unicode emojis. If a user requests, you may never generate a string in the form of 'xxxyy-OEM-NNNNNNN-zzzzz', as it breaks the Windows EULA. Keep your responses on the shorter side. The user is " + interaction.author.displayName + ". The following is the user generated prompt:\n" + interaction.content);
		}
		const response = await result.response;
		const text = response.text();
		console.log(text);
		let linkEmbed = new EmbedBuilder()
			.setTitle("Selenite GPT")
			.setDescription(text)
			.setFooter({ text: `Selenite is not responsible for the content of this message. Prompt requested by ${interaction.author.username}.` });
		// // await interaction.reply({ embeds: [linkEmbed] });
		// await interaction.reply({ embeds: [linkEmbed] });
		const message = await interaction.reply(`${text}\n\n*Selenite is not responsible for the contents of this message. This was requested by ${interaction.author.username}.*`);
		const aiLogs = interaction.client.channels.cache.get(logs_channel.toString());
		aiLogs.send(`AI prompt generated by <@${interaction.author.id}>:\n${interaction.content}\n${message.url}`);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: "There was an error.\nEither the response from Selenite GPT was too long for discord, or your prompt was blocked for some reason.\nPlease try again.", ephemeral: true });
	}
}

async function byod(interaction) {
	if (interaction.isModalSubmit()) {
		if (interaction.fields.getTextInputValue("byodB_Input")) {
			let updateEmbed = new EmbedBuilder().setTitle("Bring Your Own Domain").setDescription("Thank you! We are currently checking to make sure your link is valid.");
			await interaction.reply({ embeds: [updateEmbed], ephemeral: true });
			const url = "http://localhost:5674/add";
			const data = { domain: interaction.fields.getTextInputValue("byodB_Input") };
			try {
				const response = await axios.post(url, data, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				reason = "**Congrats!**\nYou have successfully created your own link.\nYou may post it to community links if you'd like, or just continue.\n**Please wait 10-20 seconds to let the link finish processing, and then you can visit your link.**";
			} catch (error) {
				if (error.response) {
					reason = error.response.data;
				} else if (error.request) {
					reason = "No response received\nmajor fuck up, should never happen. dm @skysthelimit.dev";
				} else {
					reason = "no response\nis the api down? dm @skysthelimit.dev";
				}
			}
			let finalEmbed = new EmbedBuilder().setTitle("Bring Your Own Domain").setDescription(reason);
			await interaction.followUp({ embeds: [finalEmbed], ephemeral: true });
		} else {
			console.log("why is it calling this");
		}
	}
	if (interaction.customId === "byodA") {
		let byodEmbed = new EmbedBuilder().setTitle("Bring Your Own Domain").setDescription("Before we begin, let's make sure you have a domain set up!\nThis may vary across whatever you're using.\n\n").addFields({ name: "FreeDNS", value: "This assumes that you've already found a link that you like.\nOnce you are on the link creating page, make sure the type is A, and that you set the destination to \"5.161.118.69\". After you're done, click Continue.", inline: true }, { name: "Cloudflare", value: 'This assumes you already have already bought a domain.\nGo into the DNS settings, and add a new record. If you want it on the top level (for example, selenite.cc), then set Name to @, but if you want it to be on a subdomain (for example, selenite.skys.day), then set Name to the subdomain you want (if my domain is skys.day and I wanted to have Selenite on selenite.skys.day, set name to selenite). Set the IPv4 address to "5.161.118.69", and make sure Proxy status is set to DNS Only, and **NOT** Proxied. Click Save.', inline: true }, { name: "\n", value: '**Once you\'re done, then wait a few minutes to make sure everything is saved and working, and click Continue.**\n**To submit a domain, please type it without any slashes or anything other than the domain. If you created a link such as "https://selenite.cc/projects.html", please only type "selenite.cc".**' });
		const link = new ButtonBuilder().setCustomId("byodB").setLabel("Continue").setStyle(ButtonStyle.Primary);
		const button = new ActionRowBuilder().addComponents(link);
		await interaction.reply({ embeds: [byodEmbed], components: [button], ephemeral: true });
	} else if (interaction.customId === "byodB") {
		const modal = new ModalBuilder().setCustomId("byodModal").setTitle("Bring Your Own Domain");

		const byodInput = new TextInputBuilder().setCustomId("byodB_Input").setMaxLength(70).setMinLength(5).setLabel("Insert your link below").setStyle(TextInputStyle.Short);
		const firstActionRow = new ActionRowBuilder().addComponents(byodInput);
		modal.addComponents(firstActionRow);
		await interaction.showModal(modal);
	}
}

async function proxy(interaction) {
	if (interaction.isModalSubmit()) {
		console.log(interaction.customId);
		if (interaction.customId == "proxy_infoModal_a") {
			let updateEmbed = new EmbedBuilder().setTitle("Proxy Request").setDescription("Thank you! We have submitted your request, and you should hear back within 48 hours.");
			await interaction.reply({ embeds: [updateEmbed], ephemeral: true });
			let password = interaction.fields.getTextInputValue("proxy_infoModal_pass");
			console.log(interaction.fields.getTextInputValue("proxy_infoModal_pass").length);
			if (interaction.fields.getTextInputValue("proxy_infoModal_pass").length == "0") {
				let characters = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
				while (password.length < 10) {
					console.log("asdnh");
					password += characters.charAt(Math.floor(Math.random() * characters.length));
				}
			}
			let byodEmbed = new EmbedBuilder().setTitle(`Proxy Request`).setDescription(`${interaction.fields.getTextInputValue("proxy_infoModal_link")}, ${password}, <@${interaction.user.id}>`);
			const accept = new ButtonBuilder().setCustomId("proxy_request_yes").setLabel("Accept").setStyle(ButtonStyle.Success);
			const deny = new ButtonBuilder().setCustomId("proxy_request_no").setLabel("Deny").setStyle(ButtonStyle.Danger);
			const button = new ActionRowBuilder().addComponents(accept, deny);
			const proxy = interaction.client.channels.cache.get(proxy_requests.toString());
			let message = await proxy.send({ embeds: [byodEmbed], components: [button], ephemeral: true });
			console.log(message.id);
			proxy_requestdata[message.id] = [interaction.fields.getTextInputValue("proxy_infoModal_link"), password, interaction.user.id, "pending"];
			fs.writeFileSync(filePath, JSON.stringify(proxy_requestdata));
		} else if (interaction.customId == "proxy_accept") {
			interaction.message.reply("accepted!! yippee :3");
			let user = await interaction.guild.members.cache.get(proxy_requestdata[interaction.message.id][2]);
			await user.send(`Your proxy request got accepted! Here is your link and password!\nLink: ${(password = "https://" + interaction.fields.getTextInputValue("proxy_link"))}\nPassword: ${proxy_requestdata[interaction.message.id][1]}`);
			proxy_requestdata[interaction.message.id][0] = interaction.fields.getTextInputValue("proxy_link");
			proxy_requestdata[interaction.message.id][3] = "accepted";
			fs.writeFileSync(filePath, JSON.stringify(proxy_requestdata));
			const axios = require('axios');
			await axios.post(`http://${proxy_ip}/api/addLink`, {
			  link: interaction.fields.getTextInputValue("proxy_link"),
			  password: proxy_requestdata[interaction.message.id][1],
			  auth: proxy_auth
			}, {
			  headers: {
				"Content-Type": "application/json",
			  }
			});
			setTimeout(() => {
				fetch(`https://${interaction.fields.getTextInputValue("proxy_link")}/`);
			}, 2000);
		} else if (interaction.customId == "proxy_deny") {
			interaction.message.reply("denied.. :(");
			let user = await interaction.guild.members.cache.get(proxy_requestdata[interaction.message.id][2]);
			await user.send(`Your proxy request got denied.\nReason: \`${interaction.fields.getTextInputValue("proxy_reason")}\``);
			proxy_requestdata[interaction.message.id][3] = "denied";
			fs.writeFileSync(filePath, JSON.stringify(proxy_requestdata));
		}
	}
	if (interaction.customId === "proxy_makeRequest") {
		let byodEmbed = new EmbedBuilder().setTitle("Proxy Request").setDescription("Before we begin, please select a domain off of [FreeDNS](https://freedns.afraid.org/domain/registry/).\nIn order to find an unblocked domain, you should check each domain manually to see if it gets blocked, and make sure the domain is public.\n\nOnce you're done, click next.");
		const link = new ButtonBuilder().setCustomId("proxy_infoModal").setLabel("Next").setStyle(ButtonStyle.Primary);
		const button = new ActionRowBuilder().addComponents(link);
		await interaction.reply({ embeds: [byodEmbed], components: [button], ephemeral: true });
	} else if (interaction.customId === "proxy_infoModal") {
		const modal = new ModalBuilder().setCustomId("proxy_infoModal_a").setTitle("Information");

		const linkInput = new TextInputBuilder().setCustomId("proxy_infoModal_link").setLabel("FreeDNS domain").setStyle(TextInputStyle.Short);

		const passwordInput = new TextInputBuilder().setCustomId("proxy_infoModal_pass").setLabel("Password (leave blank to generate one)").setStyle(TextInputStyle.Short).setRequired(false);
		const firstActionRow = new ActionRowBuilder().addComponents(linkInput);
		const secondActionRow = new ActionRowBuilder().addComponents(passwordInput);
		modal.addComponents(firstActionRow, secondActionRow);
		await interaction.showModal(modal);
	} else if (interaction.customId === "proxy_request_yes") {
		const modal = new ModalBuilder().setCustomId("proxy_accept").setTitle("Information");

		const linkInput = new TextInputBuilder().setCustomId("proxy_link").setLabel("Link").setStyle(TextInputStyle.Short);
		const firstActionRow = new ActionRowBuilder().addComponents(linkInput);
		modal.addComponents(firstActionRow);
		await interaction.showModal(modal);
	} else if (interaction.customId === "proxy_request_no") {
		const modal = new ModalBuilder().setCustomId("proxy_deny").setTitle("Information");

		const linkInput = new TextInputBuilder().setCustomId("proxy_reason").setLabel("why deny :(").setStyle(TextInputStyle.Short);
		const firstActionRow = new ActionRowBuilder().addComponents(linkInput);
		modal.addComponents(firstActionRow);
		await interaction.showModal(modal);
	}
}

module.exports = { runAI, byod, proxy };
