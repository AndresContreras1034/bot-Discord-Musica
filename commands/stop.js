const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la música y limpia la cola.'),

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

    const guildId = interaction.guild.id;
    const connection = getVoiceConnection(guildId);

    if (!connection) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ No hay música reproduciéndose')
            .setDescription('El bot no está en un canal de voz.')
        ]
      });
    }

    connection.destroy();
    interaction.client.queues.delete(guildId);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('DarkRed')
          .setTitle('🛑 Música detenida')
          .setDescription('Se ha eliminado la cola y desconectado del canal de voz.')
          .setTimestamp()
      ]
    });
  }
};
