const { SlashCommandBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Mezcla el orden de las canciones en la cola (excepto la actual).'),

  async execute(interaction) {
    if (!isDJ(interaction)) {
      return interaction.reply({ content: '🎧 Solo usuarios con rol DJ pueden usar este comando.', ephemeral: true });
    }

    const queue = interaction.client.queues.get(interaction.guild.id);
    if (!queue || queue.songs.length <= 1) {
      return interaction.reply('❌ No hay suficientes canciones para mezclar.');
    }

    const [actual, ...resto] = queue.songs;
    for (let i = resto.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resto[i], resto[j]] = [resto[j], resto[i]];
    }

    queue.songs = [actual, ...resto];
    return interaction.reply('🔀 Cola mezclada.');
  }
};
