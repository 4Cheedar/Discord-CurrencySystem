const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("diario")
    .setDescription("Recompensa Diaria"),
  async execute(interaction, client) {
    let randomNumber = Math.floor(Math.random() * 7500) + 1;

    let diario = await cs.daily({
      user: interaction.user,
      guild: interaction.guild,
      amount: randomNumber,
    });

    let embedDiario = new EmbedBuilder();

    if (diario.error) {
      embedDiario
        .setTitle("⏰ | Comando Em Cooldown!")
        .setThumbnail(
          "https://media2.giphy.com/media/StXFAImziJyPZM7xtI/giphy.gif"
        )
        .setColor("Red")
        .addFields([{ name: "> Tempo Faltando:", value: `${diario.time}` }]);

      return interaction.reply({ embeds: [embedDiario], ephemeral: true });
    } else {
      embedDiario
        .setTitle("💸 | Recompensa Diaria")
        .setThumbnail(
          client.user.displayAvatarURL({ dynamic: true, format: "png" })
        )
        .setColor("Orange")
        .addFields([
          {
            name: "💵 | Dinheiro Ganho:",
            value: `R$${diario.amount}`,
          },
          {
            name: "💰| Recompensas Diarias Coletadas:",
            value: `${diario.rawData.streak.daily}`,
          },
        ]);
      interaction.reply({ embeds: [embedDiario], ephemeral: true });
    }
  },
};
