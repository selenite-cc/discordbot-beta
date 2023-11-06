const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("8ball")
  .setDescription("View your current level.")
  .addStringOption((opt) => opt.setName("question").setDescription("Question").setRequired(true)),
  async execute(interaction) {
    try {
      let eightballEmbed = new EmbedBuilder().setTitle("8ball").addFields( { name: interaction.options.getString("question"), value: eightball[Math.round(Math.random() * (eightball.length - 1))]} );
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
    "Reply hazy, try again",
	"Ask again later",
	"Better not tell you now",
	"Cannot predict now",
	"Concentrate and ask again",
    "Don't count on it",
	"My reply is no",
	"My sources say no",
	"Outlook not so good",
	"Very doubtful"
]