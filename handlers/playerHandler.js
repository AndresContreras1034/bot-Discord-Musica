const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior
} = require('@discordjs/voice');

const playdl = require('play-dl');

async function playSong(interaction, song, queueData) {
  try {
    const stream = await playdl.stream(song.url);
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
      inlineVolume: true // permite controlar el volumen luego
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
      if (queueData.loop) {
        await playSong(interaction, queueData.songs[0], queueData); // repetir la misma
        return;
      }

      queueData.songs.shift();

      if (queueData.songs.length > 0) {
        await playSong(interaction, queueData.songs[0], queueData);
      } else {
        queueData.connection.destroy();
        interaction.client.queues.delete(interaction.guild.id);
      }
    });

    return interaction.editReply(`🎶 Reproduciendo: **${song.title}**`);
  } catch (error) {
    console.error(`❌ Error al reproducir ${song.title}:`, error);
    queueData.connection?.destroy();
    interaction.client.queues.delete(interaction.guild.id);
    return interaction.editReply('⚠️ Hubo un error al reproducir esta canción.');
  }
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
        player: null,
        loop: false
      };

      interaction.client.queues.set(guildId, queue);
      return await playSong(interaction, song, queue);
    } else {
      queue.songs.push(song);
      return await interaction.editReply(`📥 Añadido a la cola: **${song.title}**`);
    }
  }
};

