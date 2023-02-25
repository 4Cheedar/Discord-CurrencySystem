const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({
  filePath: "QuickDB/Registros/registroGeral.sqlite",
  table: "REGISTROS",
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unregister")
    .setDescription("Apaga sua Conta Registrada!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let infoVerificarNick = await db.get(
      `userInfo-${interaction.user.id}.userNick`
    );
    let infoVerificarRegistro = await db.get(
      `userInfo-${interaction.user.id}.userRegister`
    );

    if (infoVerificarRegistro != true) {
      return interaction.reply({
        content: "**Nenhuma Conta Registrada, Impossivel Apagar!**",
        ephemeral: true,
      });
    }

    let EmbedUnregister = new EmbedBuilder()
      .setTitle(`${interaction.user.username} | Conta Apagada!`)
      .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
      .setDescription(`Sua Conta foi Removida Com Sucesso!`)
      .addFields([
        { name: "🗒️ | Conta Removida:", value: `${infoVerificarNick}` },
        { name: "📌 | ID da Conta:", value: `${interaction.user.id}` },
      ])
      .setColor("Red");

    await db.pull("allUserInfo.userNick", `${infoVerificarNick.toLowerCase()}`);
    await db.pull(
      "allUserInfo.userId",
      `${interaction.user.id} - ${interaction.user.tag}`
    );
    await db.delete(`userInfo-${interaction.user.id}`);

    return interaction.reply({ embeds: [EmbedUnregister], ephemeral: true });
  },
};
