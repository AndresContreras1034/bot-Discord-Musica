require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// Inicializar estructuras personalizadas
client.commands = new Collection();
client.queues = new Map(); // ¡esto va después de crear el cliente!

// Cargar manejador de comandos
const commandHandler = require('./handlers/commandHandler');
commandHandler(client);

// Cargar eventos
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
});

// Iniciar sesión
client.login(process.env.DISCORD_TOKEN);

