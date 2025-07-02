const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'playlists.json');

function loadData() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath));
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  savePlaylist(userId, name, songs) {
    const data = loadData();
    if (!data[userId]) data[userId] = {};
    data[userId][name] = songs;
    saveData(data);
  },

  getPlaylists(userId) {
    const data = loadData();
    return data[userId] || {};
  },

  getPlaylist(userId, name) {
    const data = loadData();
    return data[userId]?.[name] || null;
  },

  deletePlaylist(userId, name) {
    const data = loadData();
    if (data[userId]?.[name]) {
      delete data[userId][name];
      saveData(data);
      return true;
    }
    return false;
  }
};
