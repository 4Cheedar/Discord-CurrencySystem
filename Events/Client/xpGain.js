const { QuickDB } = require("quick.db");
const db = new QuickDB({
  filePath: "QuickDB/LevelPlayers/xpPlayers.sqlite",
  table: "LEVEL_PLAYERS",
});
const dbRegistro = new QuickDB({
  filePath: "QuickDB/Registros/registroGeral.sqlite",
  table: "REGISTROS",
});

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    let infoVerificarRegistro = await dbRegistro.get(
      `userInfo-${message.author.id}.userRegister`
    );

    if (infoVerificarRegistro != true) return;

    let randomNumber = Math.floor(Math.random() * (75 - 25) + 25);

    await db.add(`userLevel-${message.author.id}.xp`, randomNumber);
    await db.add(`userLevel-${message.author.id}.xpTotal`, randomNumber);

    let userLevel = (await db.get(`userLevel-${message.author.id}.level`)) || 1;
    let userXp = await db.get(`userLevel-${message.author.id}.xp`);
    let xpNeeded = userLevel * 500;
    if (userXp > xpNeeded) {
      await db.sub(`userLevel-${message.author.id}.xp`, xpNeeded);
      await db.add(`userLevel-${message.author.id}.level`, 1);
      await db.add(`userLevel-${message.author.id}.points`, 1);
    }
  },
};
