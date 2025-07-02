const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config/config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setdj')
    .setDescription('Define qué rol puede controlar la música.')
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Rol a asignar como DJ')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Solo un administrador puede usar este comando.', ephemeral: true });
    }

    const rol = interaction.options.getRole('rol');

    // Guardar en config.json
    const config = require(configPath);
    config.djRoleName = rol.name;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    return interaction.reply(`🎧 El rol DJ ha sido establecido como: **${rol.name}**`);
  }
};
