const { SlashCommandBuilder } = require('discord.js');
const playlistHandler = require('../../handlers/playlistHandler');
const playerHandler = require('../../handlers/playerHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .addSubcommand(sub =>
      sub.setName('play')
        .setDescription('Reproduce una de tus playlists guardadas.')
        .addStringOption(opt =>
          opt.setName('nombre')
            .setDescription('Nombre de tu playlist')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const nombre = interaction.options.getString('nombre');
    const playlist = playlistHandler.getPlaylist(interaction.user.id, nombre);

    if (!playlist) return interaction.reply(`❌ No se encontró la playlist **${nombre}**.`);

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: '🔊 Debes estar en un canal de voz.', ephemeral: true });

    await interaction.deferReply();

    const queue = interaction.client.queues.get(interaction.guild.id);

    if (!queue) {
      for (const song of playlist) {
        await playerHandler.handle(interaction, song.url, song.title);
      }
    } else {
      playlist.forEach(song => queue.songs.push(song));
      interaction.editReply(`📥 Playlist **${nombre}** añadida a la cola (${playlist.length} canciones).`);
    }
  }
};
