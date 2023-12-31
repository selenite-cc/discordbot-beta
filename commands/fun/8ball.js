const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("8ball")
  .setDescription("You ask, and the bot answers!")
  .addStringOption((opt) => opt.setName("question").setDescription("Question").setRequired(true)),
  async execute(interaction) {
    try {
      let eightballEmbed = new EmbedBuilder()
	  .setDescription(`> **Question:** ${interaction.options.getString("question")}\n> **Answer:** *${eightball[Math.floor(Math.random() * eightball.length)]}*`)
	  .setColor("#0099ff")
	  .setFooter({
		text: `requested from ${interaction.user.username}`,
		iconURL: interaction.user.displayAvatarURL()
	  });

      await interaction.reply({ embeds: [eightballEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("There was an error. Please ping the owner if you see this.");
    }
  },
};

let eightball = [
    "As I see it, yes",
	"It is certain",
	"It is decidedly so",
	"Most likely",
	"Outlook good",
	"Signs point to yes",
	"Without a doubt",
	"Yes",
	"Yes - definitely",
	"You may rely on it",
	"Ask again later",
	"Better not tell you now",
    "Don't count on it",
	"My reply is no",
	"My sources say no",
	"Outlook not so good",
	"Very doubtful"
]