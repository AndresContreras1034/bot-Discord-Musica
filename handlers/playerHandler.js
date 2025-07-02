const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const playdl = require('play-dl');

async function playSong(interaction, song, queueData) {
  const stream = await playdl.stream(song.url);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  });

  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    }
  });

  queueData.player = player;
  queueData.connection.subscribe(player);
  player.play(resource);

  player.on(AudioPlayerStatus.Idle, async () => {
    queueData.songs.shift();
    if (queueData.songs.length > 0) {
      await playSong(interaction, queueData.songs[0], queueData);
    } else {
      queueData.connection.destroy();
      interaction.client.queues.delete(interaction.guild.id);
    }
  });

  return interaction.editReply(`🎶 Reproduciendo: **${song.title}**`);
}

module.exports = {
  async handle(interaction, url, title) {
    const voiceChannel = interaction.member.voice.channel;
    const guildId = interaction.guild.id;
    let queue = interaction.client.queues.get(guildId);

    const song = { url, title };

    if (!queue) {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      queue = {
        connection,
        songs: [song],
        player: null
      };

      interaction.client.queues.set(guildId, queue);
      return await playSong(interaction, song, queue);
    } else {
      queue.songs.push(song);
      return await interaction.editReply(`📥 Añadido a la cola: **${song.title}**`);
    }
  }
};
