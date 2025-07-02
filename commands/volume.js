const { SlashCommandBuilder } = require('discord.js');
const isDJ = require('../../utils/isDJ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Cambia el volumen de reproducción.')
    .addIntegerOption(opt =>
      opt.setName('valor')
        .setDescription('Volumen (1 a 100)')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!isDJ(interaction)) {
      return interaction.reply({ content: '🎧 Solo usuarios con rol DJ pueden usar este comando.', ephemeral: true });
    }

    const valor = interaction.options.getInteger('valor');
    if (valor < 1 || valor > 100) {
      return interaction.reply('⚠️ El volumen debe estar entre 1 y 100.');
    }

    const queue = interaction.client.queues.get(interaction.guild.id);
    if (!queue || !queue.player) {
      return interaction.reply('❌ No hay música reproduciéndose.');
    }

    queue.player.state.resource.volume.setVolume(valor / 100);
    return interaction.reply(`🔊 Volumen ajustado a **${valor}%**.`);
  }
};
