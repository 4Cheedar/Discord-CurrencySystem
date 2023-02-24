const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "Comando ta bixado!",
        ephemeral: true,
      });

    if (command.developer && interaction.user.id !== "355122356731248651")
      return interaction.reply({
        content: "Comando Disponivel apenas para Desenvolvedor!",
        ephemeral: true,
      });

    command.execute(interaction, client);
  },
};
