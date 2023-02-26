const { SlashCommandBuilder } = require("discord.js");
const console = require("console-emoji-log");
const fs = require("fs");
const https = require("https");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("add-item")
    .setDescription("Adiciona Itens na Loja!")
    .addAttachmentOption((option) =>
      option
        .setName("imagem")
        .setDescription("Imagem do Item")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("item").setDescription("Nome do Item").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Descrição do Item")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("preco")
        .setDescription("Preco do Item")
        .setRequired(true)
        .setMinValue(1)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    let imgTeste = interaction.options.getAttachment("imagem");
    let nameItem = interaction.options.getString("item");
    let descriptionItem = interaction.options.getString("description");
    let precoItem = interaction.options.getInteger("preco");

    const url = `${imgTeste.attachment}`;

    https.get(url, (res) => {
      const path = `./CurrencyImages/ItensLoja/${nameItem}.png`;
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => {
        filePath.close();
        console.success(
          `[ IMAGEM SALVA ] Arquivo: ${nameItem} Baixado Com Sucesso!`
        );
      });
    });

    let itemAddShop = await cs.addItem({
      guild: interaction.guild,
      inventory: {
        name: nameItem,
        price: precoItem,
        description: descriptionItem || "Sem Descrição!",
      },
    });

    if (itemAddShop.error)
      return interaction.reply({
        content: "Deu algum B.O ai meu chefe!",
        error: itemAddShop.error,
        ephemeral: true,
      });

    console.success(
      `[ SHOP ADD ] Item: ${nameItem} Adicionado na Loja com Sucesso!`
    );

    return interaction.reply({
      content: `> Item: **${nameItem}** Adicionado Com Sucesso!`,
      ephemeral: true,
    });
  },
};
