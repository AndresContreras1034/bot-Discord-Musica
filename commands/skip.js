const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta la canción actual (si hay otra en cola).'),

  async execute(interaction) {
    const queue = interaction.client.queues.get(interaction.guild.id);

    if (!queue || queue.songs.length <= 1) {
      return interaction.reply('❌ No hay más canciones en la cola para saltar.');
    }

    // Remover la actual
    queue.songs.shift();

    // Ejecutar la siguiente
    queue.player.stop(); // Se activa el evento .on(AudioPlayerStatus.Idle)
    return interaction.reply('⏭️ Canción saltada.');
  }
};
