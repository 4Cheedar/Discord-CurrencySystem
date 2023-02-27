const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const { createCanvas, Canvas, loadImage, registerFont } = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loja")
    .setDescription("Mostra os itens da Loja"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    await interaction.deferReply();
    let result = await cs.getShopItems({
      guild: interaction.guild,
    });

    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext("2d");

    const planoFundo = await loadImage(
      "./CurrencyImages/CurrencySystem-shop.png"
    );

    registerFont("./CurrencyImages/Fonts/Minecraftia-Regular.ttf", {
      family: "Minecraftia",
    });

    ctx.drawImage(planoFundo, 0, 0, canvas.width, canvas.height);

    let pos1 = 18;
    let pos2 = 95;
    let posDin = 205;
    let posID = 120;

    for (let key in result.inventory) {
      let itemAdd = await loadImage(
        `./CurrencyImages/ItensLoja/${result.inventory[key].name}.png`
      );

      ctx.drawImage(itemAdd, pos1, pos2, 75, 75);

      ctx.font = '20px "Minecraftia"';
      ctx.fillStyle = "#228B22";
      ctx.fillText(`$ ${result.inventory[key].price}`, pos1, posDin);

      ctx.font = '20px "Minecraftia"';
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${parseInt(key) + 1}`, pos1, posID);

      if (key == 2 || key == 8 || key == 14) {
        pos1 += 160;
      } else if (key == 5) {
        pos2 = 215;
        pos1 = 18;
        posDin = 325;
        posID = 242;
      } else if (key == 11) {
        pos2 = 335;
        pos1 = 18;
        posDin = 447;
        posID = 360;
      } else {
        pos1 += 130;
      }
    }

    var imgShop = new AttachmentBuilder(canvas.toBuffer(), "ShopItens.png");

    return interaction.editReply({
      files: [imgShop],
    });
  },
};
