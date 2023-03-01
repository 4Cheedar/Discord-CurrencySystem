const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const console = require("console-emoji-log");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

// * Quick.DB - Database
const { QuickDB } = require("quick.db");
const dbLojaWallpapers = new QuickDB({
  filePath: "QuickDB/LojaWallpapers/wallpapersShop.sqlite",
  table: "SHOP_WALLPAPERS",
});

const fs = require("fs");
const wallpapersPaste = "./CurrencyImages/BackgroundsShop";

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("comprar")
    .setDescription("Comprar algum item da loja!")
    .addSubcommand((options) =>
      options
        .setName("itens")
        .setDescription("Usado para comprar itens na loja!")
        .addIntegerOption((options) =>
          options
            .setName("comprar-id")
            .setDescription("ID do item que deseja comprar!")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("wallpapers")
        .setDescription(
          "Usado para comprar Wallpapers para seu meu de Informações!"
        )
        .addIntegerOption((options) =>
          options
            .setName("comprar-id")
            .setDescription("ID do wallpaper que deseja comprar!")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(9)
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let subCommand = interaction.options.getSubcommand();
    let idEscolhido = interaction.options.getInteger("comprar-id");

    switch (subCommand) {
      case "itens":
        let compra = await cs.buy({
          user: interaction.user,
          guild: interaction.guild,
          item: idEscolhido,
          amount: 1,
        });

        if (compra.error) {
          return interaction.reply({
            content:
              "É meu chefe... deu algum b.o ai, nao conseguiu comprar o item nao...",
            ephemeral: true,
          });
        }

        let shopEmbed = new EmbedBuilder()
          .setTitle("🛒 | Lojinha do Discord!")
          .setColor("Random")
          .setTimestamp()
          .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
          .setDescription(`Item Comprado com Sucesso!`)
          .setFooter({ text: `${client.user.username} | Compras` })
          .addFields([
            {
              name: `💸 | Item Comprado: ${compra.inventory.name} `,
              value: `\`\`\`✓ Preço: R$ ${compra.inventory.price}\`\`\``,
            },
          ]);

        return interaction.reply({
          embeds: [shopEmbed],
          ephemeral: true,
        });
        break;

      case "wallpapers":
        if (!(await dbLojaWallpapers.has(`shopWallpapers`))) {
          await dbLojaWallpapers.set(`shopWallpapers`, {
            precoWallpaper: 25000,
          });
        }

        let dinheiro = await cs.balance({
          user: interaction.user,
          guild: interaction.guild.id,
        });

        let precoWallpaper = await dbLojaWallpapers.get(
          "shopWallpapers.precoWallpaper"
        );

        let userWallpapers = await dbLojaWallpapers.get(
          `userWallpapers-${interaction.user.id}.ownedWallpapers`
        );

        if (dinheiro.wallet < precoWallpaper) {
          return interaction.reply({
            content: "Sem Dinheiro na carteira para comprar o Wallpaper!",
            ephemeral: true,
          });
        }

        fs.readdir(wallpapersPaste, async function (err, files) {
          for (key in files) {
            if (idEscolhido == parseInt(key) + 1) {
              for (wallpaper in userWallpapers) {
                if (files[key] == userWallpapers[wallpaper]) {
                  return interaction.reply({
                    content: "Esse Wallpaper já foi comprado!",
                    ephemeral: true,
                  });
                } else {
                  let comprarWallpaper = await cs.removeMoney({
                    user: interaction.user.id,
                    guild: interaction.guild,
                    amount: precoWallpaper,
                    wheretoPutMoney: "wallet",
                  });

                  if (comprarWallpaper.error)
                    return console.log("Deu B.o na compra do Wallpaper!");

                  await dbLojaWallpapers.push(
                    `userWallpapers-${interaction.user.id}.ownedWallpapers`,
                    `${files[key]}`
                  );

                  return interaction.reply({
                    content: "Wallpaper Comprado com sucesso!",
                    ephemeral: true,
                  });
                }
              }
            }
          }
        });
        break;
    }
  },
};
