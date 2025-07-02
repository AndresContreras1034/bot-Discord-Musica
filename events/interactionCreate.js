module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`❌ Error en el comando ${interaction.commandName}:`, error);
      await interaction.reply({ content: '⚠️ Hubo un error al ejecutar el comando.', ephemeral: true });
    }
  }
};
