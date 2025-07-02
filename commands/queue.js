const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Muestra la cola de canciones.'),

  async execute(interaction) {
    const queue = interaction.client.queues.get(interaction.guild.id);

    if (!queue || queue.songs.length === 0) {
      return interaction.reply('📭 La cola está vacía.');
    }

    const embed = new EmbedBuilder()
      .setTitle('🎵 Cola actual')
      .setDescription(queue.songs.map((s, i) => `${i === 0 ? '▶️' : `${i + 1}.`} ${s.title}`).join('\n'))
      .setColor('Random');

    return interaction.reply({ embeds: [embed] });
  }
};
