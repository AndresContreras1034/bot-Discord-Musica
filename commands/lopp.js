const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Activa o desactiva el loop de la canción actual.'),

  async execute(interaction) {
    const queue = interaction.client.queues.get(interaction.guild.id);
    if (!queue || !queue.player) {
      return interaction.reply('❌ No hay ninguna canción reproduciéndose.');
    }

    queue.loop = !queue.loop;

    return interaction.reply(`🔁 Loop ${queue.loop ? 'activado' : 'desactivado'}.`);
  }
};
