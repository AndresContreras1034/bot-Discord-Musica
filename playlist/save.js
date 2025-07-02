const { SlashCommandBuilder } = require('discord.js');
const playlistHandler = require('../../handlers/playlistHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Gestiona tus playlists.')
    .addSubcommand(sub =>
      sub.setName('save')
        .setDescription('Guarda la cola actual como una playlist.')
        .addStringOption(opt =>
          opt.setName('nombre')
            .setDescription('Nombre de la playlist')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const queue = interaction.client.queues.get(interaction.guild.id);
    if (!queue || queue.songs.length === 0) {
      return interaction.reply('❌ No hay canciones para guardar.');
    }

    const nombre = interaction.options.getString('nombre');
    playlistHandler.savePlaylist(interaction.user.id, nombre, queue.songs);
    return interaction.reply(`✅ Playlist **${nombre}** guardada con ${queue.songs.length} canciones.`);
  }
};
