const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const playlistHandler = require('../../handlers/playlistHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Lista tus playlists guardadas.')
    ),

  async execute(interaction) {
    const playlists = playlistHandler.getPlaylists(interaction.user.id);
    const nombres = Object.keys(playlists);

    if (nombres.length === 0) {
      return interaction.reply('📭 No tienes playlists guardadas.');
    }

    const embed = new EmbedBuilder()
      .setTitle(`📂 Playlists de ${interaction.user.username}`)
      .setDescription(nombres.map(name => `🎵 ${name} (${playlists[name].length} canciones)`).join('\n'))
      .setColor('Blue');

    return interaction.reply({ embeds: [embed] });
  }
};
