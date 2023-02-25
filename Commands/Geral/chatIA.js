const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const wait = require("node:timers/promises").setTimeout;
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat-bot")
    .setDescription("Comando para conversar com uma Inteligencia Artificial")
    .addStringOption((option) =>
      option
        .setName("mensagem")
        .setDescription("Mensagem para a Inteligencia Artificial")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await wait(4000);

    let inputString = interaction.options.getString("mensagem");

    const configuration = new Configuration({
      apiKey: process.env.TOKEN_IA,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${inputString}`,
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
    });

    let embedIA = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("Inteligencia Artificial:")
      .setDescription(`${response.data.choices[0].text}`);

    return interaction.editReply({
      embeds: [embedIA],
      ephemeral: true,
    });
  },
};
