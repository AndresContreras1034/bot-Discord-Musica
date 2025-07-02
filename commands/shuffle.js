const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Mezcla el orden de las canciones en la cola (excepto la actual).'),

  async execute(interaction) {
    const queue = interaction.client.queues.get(interaction.guild.id);
    if (!queue || queue.songs.length <= 1) {
      return interaction.reply('❌ No hay suficientes canciones para mezclar.');
    }

    const [current, ...rest] = queue.songs;
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    queue.songs = [current, ...rest];

    return interaction.reply('🔀 Cola mezclada.');
  }
};
