const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const dotenv = require("dotenv");
const console = require("console-emoji-log");
const CurrencySystem = require("currency-system");
dotenv.config();

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");

client.events = new Collection();
client.commands = new Collection();

loadEvents(client);

client.login(process.env.DEVBOT_TOKEN);

// mongoose
const { connect } = require("mongoose");
connect(process.env.MONGODB_CONNECT, {}).then(() =>
  console.success("Bot Conectado com o Banco de Dados!")
);

// *  Currency-System
const cs = new CurrencySystem();
// * Conectando Mongoose no Currency
cs.setMongoURL(process.env.MONGODB_CONNECT);
// * Dinheiro Padrão na Carteira
cs.setDefaultWalletAmount(250);
// * Dinheiro Maximo no Banco
cs.setMaxBankAmount(5000000000);
// * Dinheiro Maximo na Carteira
cs.setMaxWalletAmount(500000);
// * Procurar Atualizações
cs.searchForNewUpdate(true);
