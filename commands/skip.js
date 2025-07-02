const { SlashCommandBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta la canción actual (si hay otra en cola).'),

  async execute(interaction) {
    if (!isDJ(interaction)) {
      return interaction.reply({ content: '🎧 Solo usuarios con rol DJ pueden usar este comando.', ephemeral: true });
    }

    const queue = interaction.client.queues.get(interaction.guild.id);
    if (!queue || queue.songs.length <= 1) {
      return interaction.reply('❌ No hay más canciones en la cola.');
    }

    queue.songs.shift();
    queue.player.stop();
    return interaction.reply('⏭️ Canción saltada.');
  }
};
