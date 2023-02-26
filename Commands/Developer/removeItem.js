const { SlashCommandBuilder } = require("discord.js");
const console = require("console-emoji-log");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("remove-item")
    .setDescription("Remove Itens da Loja!")
    .addIntegerOption((option) =>
      option
        .setName("id-item")
        .setDescription("ID do Item para remover!")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    let idItem = interaction.options.getInteger("id-item");

    let removeItemShop = await cs.removeItem({
      guild: interaction.guild,
      item: idItem,
    });

    if (removeItemShop.error)
      return interaction.reply({
        content: "Deu algum B.O ai meu chefe!",
        error: removeItemShop.error,
        ephemeral: true,
      });

    console.success(
      `[ SHOP REMOVE ] Item: ID-${idItem} Removido da Loja na Loja com Sucesso!`
    );

    return interaction.reply({
      content: `> Item: ID-${idItem} Removido da Loja na Loja com Sucesso!`,
      ephemeral: true,
    });
  },
};
