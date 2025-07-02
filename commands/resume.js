const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Reanuda la canción actual.'),

  async execute(interaction) {
    const queue = interaction.client.queues.get(interaction.guild.id);

    if (!queue || !queue.player) {
      return interaction.reply('❌ No hay ninguna canción pausada.');
    }

    queue.player.unpause();
    return interaction.reply('▶️ Canción reanudada.');
  }
};
