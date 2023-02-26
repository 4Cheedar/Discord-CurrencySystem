const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const { createCanvas, Canvas, loadImage, registerFont } = require("canvas");
const { QuickDB } = require("quick.db");
const db = new QuickDB({
  filePath: "QuickDB/Registros/registroGeral.sqlite",
  table: "REGISTROS",
});
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("carteira")
    .setDescription("Permite ver seu Dinheiro!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await wait(2000);

    let dinheiro = await cs.balance({
      user: interaction.user,
      guild: interaction.guild.id,
    });

    let nickMine = await db.get(`userInfo-${interaction.user.id}.userNick`);
    let mineSkin = nickMine;

    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext("2d");

    const planoFundo = await loadImage(
      "./CurrencyImages/CurrencySystem-carteira.png"
    );

    if (!nickMine) {
      nickMine = "Sem Conta!";
      mineSkin = "MHF_Steve";
    }

    const drawImgPerfil = await loadImage(
      `https://mc-heads.net/body/${mineSkin}`
    );
    ctx.drawImage(planoFundo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(drawImgPerfil, 50, 80, 150, 350);

    // Fontes Personalizadas
    registerFont("./CurrencyImages/Fonts/Minecraftia-Regular.ttf", {
      family: "Minecraftia",
    });

    //Nick Player
    ctx.font = '38px "Minecraftia"';
    ctx.fillStyle = "#FFA500";
    ctx.fillText(`${nickMine}`, 40, 100);

    //Dinheiro na Carteira
    ctx.font = '25px "Minecraftia"';
    ctx.fillStyle = "#228B22";
    ctx.fillText(`$ ${dinheiro.wallet}`, 600, 127);

    //Dinheiro no Banco
    ctx.font = '25px "Minecraftia"';
    ctx.fillStyle = "#228B22";
    ctx.fillText(`$ ${dinheiro.bank}`, 600, 180);

    var imgCarteira = new AttachmentBuilder(
      canvas.toBuffer(),
      "CarteiraCurrency.png"
    );

    return interaction.editReply({
      content: `${dinheiro.wallet} | ${dinheiro.bank}`,
      files: [imgCarteira],
      ephemeral: true,
    });
  },
};
