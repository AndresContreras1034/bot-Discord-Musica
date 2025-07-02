const { SlashCommandBuilder } = require('discord.js');
const playlistHandler = require('../../handlers/playlistHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Elimina una de tus playlists.')
        .addStringOption(opt =>
          opt.setName('nombre')
            .setDescription('Nombre de la playlist')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const nombre = interaction.options.getString('nombre');
    const eliminado = playlistHandler.deletePlaylist(interaction.user.id, nombre);

    if (!eliminado) {
      return interaction.reply(`❌ No se encontró la playlist **${nombre}**.`);
    }

    return interaction.reply(`🗑️ Playlist **${nombre}** eliminada.`);
  }
};
