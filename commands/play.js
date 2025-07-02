const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const playdl = require('play-dl');

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
      return interaction.reply({ content: '🔊 Debes estar en un canal de voz para usar este comando.', ephemeral: true });
    }

    await interaction.deferReply();

    let url = query;

    // Si no es URL, buscar por nombre
    if (!ytdl.validateURL(query)) {
      const search = await playdl.search(query, { limit: 1 });
      if (!search[0]) return interaction.editReply('❌ No se encontraron resultados.');
      url = search[0].url;
    }

    // Conectar al canal de voz
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const stream = await playdl.stream(url);
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });

    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    await interaction.editReply(`🎶 Reproduciendo: **${url}**`);
  }
};
