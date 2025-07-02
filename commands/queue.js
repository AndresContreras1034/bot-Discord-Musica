const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Muestra la cola de canciones.'),

  async execute(interaction) {
    const queue = interaction.client.queues.get(interaction.guild.id);

    if (!queue || queue.songs.length === 0) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('📭 Cola vacía')
            .setDescription('No hay canciones en la cola.')
        ]
      });
    }

    const canciones = queue.songs
      .map((song, index) => {
        if (index === 0) return `▶️ **${song.title}** (reproduciendo)`;
        return `**${index + 1}.** ${song.title}`;
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('🎵 Cola actual')
      .setDescription(canciones)
      .setFooter({ text: `Total: ${queue.songs.length} canciones` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
