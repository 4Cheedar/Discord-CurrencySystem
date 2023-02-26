const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const console = require("console-emoji-log");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const { createCanvas, Canvas, loadImage, registerFont } = require("canvas");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("loja")
    .setDescription("Mostra os itens da Loja"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    await interaction.deferReply({
      /* ephemeral: true */
    });
    let result = await cs.getShopItems({
      guild: interaction.guild,
    });

    let arr = [];

    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext("2d");

    const planoFundo = await loadImage(
      "./CurrencyImages/CurrencySystem-shop.png"
    );

    registerFont("./CurrencyImages/Fonts/Minecraftia-Regular.ttf", {
      family: "Minecraftia",
    });

    ctx.drawImage(planoFundo, 0, 0, canvas.width, canvas.height);

    let pos1 = 75;
    let pos2 = 120;
    let posDin = 260;

    for (let key in result.inventory) {
      let itemAdd = await loadImage(
        `./CurrencyImages/ItensLoja/${result.inventory[key].name}.png`
      );

      ctx.drawImage(itemAdd, pos1, pos2, 115, 115);

      //Dinheiro na Carteira
      ctx.font = '20px "Minecraftia"';
      ctx.fillStyle = "#228B22";
      ctx.fillText(`$ ${result.inventory[key].price}`, pos1, posDin);

      pos1 += 150;

      if (key >= 3) {
        pos2 = 270;
        posDin = 410;
        pos1 = 75;

        if (key >= 4) {
          pos1 += 150;
        }
      }

      arr.push({
        name: `${parseInt(key)} - **${result.inventory[key].name}**, preço: $${
          result.inventory[key].price
        }`,
        description: "Descrição: " + result.inventory[key].description,
        urlImg: `./CurrencyImages/ItensLoja/${result.inventory[key].name}.png`,
        position1: pos1,
        position2: pos2,
        positionDin: posDin,
      });
    }

    console.log(arr);

    var imgShop = new AttachmentBuilder(canvas.toBuffer(), "ShopItens.png");

    return interaction.editReply({
      content: `> Bom dia!`,
      files: [imgShop],
      ephemeral: true,
    });
  },
};
