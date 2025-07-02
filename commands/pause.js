const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa la canción actual.'),

  async execute(interaction) {
    const queue = interaction.client.queues.get(interaction.guild.id);

    if (!queue || !queue.player) {
      return interaction.reply('❌ No hay ninguna canción reproduciéndose.');
    }

    queue.player.pause();
    return interaction.reply('⏸️ Canción pausada.');
  }
};
