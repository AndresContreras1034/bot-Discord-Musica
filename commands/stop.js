const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la música y limpia la cola.'),

  async execute(interaction) {
    if (!isDJ(interaction)) {
      return interaction.reply({ content: '🎧 Solo usuarios con rol DJ pueden usar este comando.', ephemeral: true });
    }

    const guildId = interaction.guild.id;
    const connection = getVoiceConnection(guildId);

    if (connection) {
      connection.destroy();
      interaction.client.queues.delete(guildId);
      return interaction.reply('🛑 Música detenida y cola eliminada.');
    } else {
      return interaction.reply('❌ El bot no está en un canal de voz.');
    }
  }
};
