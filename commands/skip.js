const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta la canción actual.'),

  async execute(interaction) {
    if (!isDJ(interaction)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Orange')
            .setTitle('🎧 Permiso denegado')
            .setDescription('Solo usuarios con el rol DJ pueden usar este comando.')
        ],
        ephemeral: true
      });
    }

    const queue = interaction.client.queues.get(interaction.guild.id);

    if (!queue || queue.songs.length <= 1) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('⛔ No se puede saltar')
            .setDescription('No hay más canciones en la cola.')
        ]
      });
    }

    queue.songs.shift();
    queue.player.stop();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Green')
          .setTitle('⏭️ Canción saltada')
          .setDescription('Reproduciendo la siguiente canción...')
          .setTimestamp()
      ]
    });
  }
};

