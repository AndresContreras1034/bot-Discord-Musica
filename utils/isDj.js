module.exports = (interaction) => {
  const djRoleName = require('../config/config.json').djRoleName;
  const memberRoles = interaction.member.roles.cache;

  // Devuelve true si tiene el rol
  return memberRoles.some(role => role.name === djRoleName);
};
