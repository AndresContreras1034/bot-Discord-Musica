const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const playdl = require('play-dl');
const playerHandler = require('../../handlers/playerHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción desde YouTube.')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Nombre o URL de la canción')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '🔊 Debes estar en un canal de voz.', ephemeral: true });
    }

    await interaction.deferReply();

    let url = query;
    let title = '';

    // Si no es URL, buscar por nombre
    if (!ytdl.validateURL(query)) {
      const result = await playdl.search(query, { limit: 1 });
      if (!result[0]) return interaction.editReply('❌ No se encontró ningún resultado.');
      url = result[0].url;
      title = result[0].title;
    } else {
      const info = await ytdl.getInfo(query);
      title = info.videoDetails.title;
    }

    await playerHandler.handle(interaction, url, title);
  }
};

