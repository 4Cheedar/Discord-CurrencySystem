const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const { createCanvas, Canvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loja")
    .setDescription("Mostra os itens da Loja")
    .addSubcommand((options) =>
      options.setName("items").setDescription("Mostra a loja de Itens")
    )
    .addSubcommand((options) =>
      options
        .setName("wallpapers")
        .setDescription("Mostra a loja de Wallpapers")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    await interaction.deferReply();
    const subCommand = interaction.options.getSubcommand();
    const wallpapersPaste = "./CurrencyImages/BackgroundsShop";

    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext("2d");

    registerFont("./CurrencyImages/Fonts/Minecraftia-Regular.ttf", {
      family: "Minecraftia",
    });

    switch (subCommand) {
      case "items":
        let result = await cs.getShopItems({
          guild: interaction.guild,
        });

        const planoFundoItems = await loadImage(
          "./CurrencyImages/CurrencySystem-shop.png"
        );

        ctx.drawImage(planoFundoItems, 0, 0, canvas.width, canvas.height);

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

        break;

      case "wallpapers":
        const planoFundoWallpapers = await loadImage(
          "./CurrencyImages/CurrencySystem-shopWallpaper.png"
        );
        ctx.drawImage(planoFundoWallpapers, 0, 0, canvas.width, canvas.height);

        let posOne = 85;
        let posTwo = 50;
        let posLado = 90;
        let positionID = 85;
        let posMoney = 155;

        fs.readdir(wallpapersPaste, async function (err, files) {
          for (key in files) {
            var bg = await loadImage(
              `./CurrencyImages/BackgroundsShop/${files[key]}`
            );

            if (files[key] !== "bg-default.png") {
              ctx.drawImage(bg, posOne, posTwo, 200, 100);

              ctx.font = '20px "Minecraftia"';
              ctx.fillStyle = "#FFFFFF";
              ctx.fillText(parseInt(key) + 1, posLado, positionID, 200, 100);

              ctx.font = '20px "Minecraftia"';
              ctx.fillStyle = "#FFFFFF";
              ctx.fillText(`$ 25K`, posLado, posMoney);
            }

            if (key == 2) {
              posOne = 85;
              posTwo = 175;
              posLado = 90;
              positionID = 210;
              posMoney = 280;
            } else if (key == 5) {
              posTwo = 300;
              positionID = 335;
              posLado = 90;
              posOne = 85;
              posMoney = 405;
            } else {
              posOne += 225;
              posLado += 225;
            }
          }
          var imgShopBG = new AttachmentBuilder(
            canvas.toBuffer(),
            "ShopBackgrounds.png"
          );

          return interaction.editReply({
            files: [imgShopBG],
          });
        });
        break;
    }
  },
};
