const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const playdl = require('play-dl');
const playerHandler = require('../../handlers/playerHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción desde YouTube.')
    .addStringOption(option =>
      option.setName('cancion')
        .setDescription('Nombre o URL de la canción')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('cancion');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('🔊 Debes estar en un canal de voz')
            .setDescription('Únete a un canal de voz para reproducir música.')
        ],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    try {
      let url = query;
      let title = query;

      // Si no es una URL, hacemos búsqueda
      if (!playdl.yt_validate(query)) {
        const results = await playdl.search(query, { limit: 1 });
        if (results.length === 0) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ No se encontró ninguna canción')
            ]
          });
        }

        url = results[0].url;
        title = results[0].title;
      } else {
        const info = await playdl.video_basic_info(query);
        title = info.video_details.title;
      }

      await playerHandler.handle(interaction, url, title);

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('🎶 Reproduciendo')
        .setDescription(`**${title}**`)
        .setTimestamp()
        .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('⚠️ Error al reproducir')
            .setDescription('No se pudo procesar la canción.')
        ]
      });
    }
  }
};
