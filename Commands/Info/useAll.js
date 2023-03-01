const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");

// * Quick.DB - Database
const { QuickDB } = require("quick.db");
const dbLojaWallpapers = new QuickDB({
  filePath: "QuickDB/LojaWallpapers/wallpapersShop.sqlite",
  table: "SHOP_WALLPAPERS",
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("usar")
    .setDescription("Permite usar Itens ou outras coisas")
    .addSubcommand((options) =>
      options.setName("items").setDescription("Permite usar Itens")
    )
    .addSubcommand((options) =>
      options
        .setName("wallpapers")
        .setDescription("Permite usar Wallpapers comprados!")
        .addIntegerOption((options) =>
          options
            .setName("id-wallpaper")
            .setDescription("ID do wallpaper que deseja usar!")
            .setMinValue(0)
            .setMaxValue(9)
            .setRequired(true)
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();
    const userOwnedWallpaperID = interaction.options.getInteger("id-wallpaper");

    let userWallpapers = await dbLojaWallpapers.get(
      `userWallpapers-${interaction.user.id}.ownedWallpapers`
    );

    switch (subCommand) {
      case "items":
        return console.log("[NAO TA FEITO!]");
        break;

      case "wallpapers":
        for (wallpaper in userWallpapers) {
          let wallpaperInv = parseInt(wallpaper) + 1;
          if (userOwnedWallpaperID == wallpaperInv) {
            await dbLojaWallpapers.set(
              `userWallpapers-${interaction.user.id}.usingWallpaper`,
              `bg-${wallpaperInv}.png`
            );

            return interaction.reply({
              content: "Wallpaper atualizado e utilizado com Sucesso!",
              ephemeral: true,
            });
          }
          if (userOwnedWallpaperID == 0) {
            await dbLojaWallpapers.set(
              `userWallpapers-${interaction.user.id}.usingWallpaper`,
              "bg-default.png"
            );

            return interaction.reply({
              content: "Wallpaper Default utilizado!",
              ephemeral: true,
            });
          }
        }
        break;
    }
  },
};
