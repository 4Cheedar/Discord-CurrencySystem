const { loadCommands } = require("../../Handlers/commandHandler");
const { ActivityType } = require("discord.js");
const console = require("console-emoji-log");
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.success(`${client.user.tag} Ligado com Sucesso!`);

    client.user.setPresence({
      activities: [{ name: `Bom dia`, type: ActivityType.Watching }],
      status: "dnd",
    });

    loadCommands(client);
  },
};
