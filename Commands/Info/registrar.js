const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// * === Quick.db - Database! ===
const { QuickDB } = require("quick.db");

// * = Tabela de Registros Geral =
const db = new QuickDB({
  filePath: "QuickDB/Registros/registroGeral.sqlite",
  table: "REGISTROS",
});

// * = Tabela de Status do Player =
const dbUserStatus = new QuickDB({
  filePath: "QuickDB/StatusPlayers/statusPlayers.sqlite",
  table: "PLAYERS_STATUS",
});

// * = Tabela de Wallpapers do Player =
const dbLojaWallpapers = new QuickDB({
  filePath: "QuickDB/LojaWallpapers/wallpapersShop.sqlite",
  table: "SHOP_WALLPAPERS",
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registrar")
    .setDescription("Registra seu nick do mine!")
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("Nickname do Minecraft")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let nicknameRegister = interaction.options.getString("nickname");
    let allNickVerify = await db.get(`allUserInfo.userNick`);
    let infoVerifyRegister = await db.get(
      `userInfo-${interaction.user.id}.userRegister`
    );

    if (await db.has(`allUserInfo.userNick`)) {
      for (let i = 0; i < allNickVerify.length; i++) {
        if (nicknameRegister.toLowerCase() == allNickVerify[i]) {
          return interaction.reply({
            content: "**Nick Já Registrado!**",
            ephemeral: true,
          });
        }
      }
    }

    if (infoVerifyRegister == true)
      return interaction.reply({
        content: "**Já Possui Conta Registrada!**",
        ephemeral: true,
      });

    await db.set(`userInfo-${interaction.user.id}`, {
      userId: `${interaction.user.id}`,
      userNick: `${nicknameRegister}`,
      userRegister: true,
    });

    await dbUserStatus.set(`userStatus-${interaction.user.id}`, {
      userVida: 100,
      userArmadura: 100,
      userDano: 10,
    });

    await dbLojaWallpapers.set(`userWallpapers-${interaction.user.id}`, {
      usingWallpaper: "bg-default.png",
      ownedWallpapers: [],
    });

    await db.push(
      `allUserInfo.userId`,
      `${interaction.user.id} - ${interaction.user.tag}`
    );
    await db.push(`allUserInfo.userNick`, `${nicknameRegister.toLowerCase()}`);

    let EmbedRegistro = new EmbedBuilder()
      .setTitle(`${interaction.user.username} | Conta Criada!`)
      .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
      .setDescription(`Sua Conta foi Criada Com Sucesso!`)
      .addFields([
        { name: "🗒️ | Nick:", value: `${nicknameRegister}` },
        { name: "📌 | ID da Conta:", value: `${interaction.user.id}` },
      ])
      .setColor("Orange");

    return interaction.reply({
      embeds: [EmbedRegistro],
      ephemeral: true,
    });
  },
};
