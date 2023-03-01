const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { QuickDB } = require("quick.db");
const db = new QuickDB({
  filePath: "QuickDB/LevelPlayers/xpPlayers.sqlite",
  table: "LEVEL_PLAYERS",
});
const dbRegistro = new QuickDB({
  filePath: "QuickDB/Registros/registroGeral.sqlite",
  table: "REGISTROS",
});
const dbLojaWallpapers = new QuickDB({
  filePath: "QuickDB/LojaWallpapers/wallpapersShop.sqlite",
  table: "SHOP_WALLPAPERS",
});
module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Recarrega todos os Comandos e Eventos")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) =>
      options
        .setName("level")
        .setDescription("Reseta o Level!")
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Usuario para resetar")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("xp")
        .setDescription("Reseta apenas o XP!")
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Usuario para resetar")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("registro")
        .setDescription("Reseta o Registro no Bot!")
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Usuario para resetar")
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
    const userCommand = interaction.options.getUser("user");

    let infoVerificarNick = await dbRegistro.get(
      `userInfo-${userCommand.id}.userNick`
    );

    switch (subCommand) {
      case "level":
        {
          await db.set(`userLevel-${userCommand.id}.xp`, 0);
          await db.set(`userLevel-${userCommand.id}.level`, 1);
          await db.set(`userLevel-${userCommand.id}.xpTotal`, 0);
          await db.set(`userLevel-${userCommand.id}.points`, 0);
          return interaction.reply({
            content: "Level e Xp Resetado Com Sucesso!",
            ephemeral: true,
          });
        }
        break;

      case "xp":
        {
          await db.set(`userLevel-${userCommand.id}.xp`, 0);
          return interaction.reply({
            content: "Xp Resetado Com Sucesso!",
            ephemeral: true,
          });
        }

        break;

      case "registro":
        {
          await dbRegistro.pull(
            "allUserInfo.userNick",
            `${infoVerificarNick.toLowerCase()}`
          );
          await dbRegistro.pull(
            "allUserInfo.userId",
            `${userCommand.id} - ${userCommand.tag}`
          );
          await dbRegistro.delete(`userInfo-${userCommand.id}`);
          await dbRegistro.delete(`userStatus-${userCommand.id}`);
          await dbLojaWallpapers.delete(`userWallpapers-${userCommand.id}`);

          return interaction.reply({
            content: "Registro Removido com Sucesso!",
            ephemeral: true,
          });
        }

        break;
    }
  },
};
