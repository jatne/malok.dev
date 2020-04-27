const endpoint =
  `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${process.env.lastfm_user}&api_key=${process.env.lastfm_key}&format=json`;

async function getMusicData(endpoint) {
  const response = await fetch(endpoint);
  const data = await response.json();

  return data;
}

const handleSongBar = songObj => {
  if (!songObj) {
    return false;
  }

  const songBar = document.createElement('div');
  songBar.classList.add('song-bar');
  songBar.innerHTML = `🟢 Jestem online i 🎶 właśnie słucham <a href="${songObj.url}" target="_blank">${songObj.artist} - ${songObj.name}</a>`;

  document.querySelector('.content').append(songBar);
};

const handleSongMeta = song => {
  if (!song.length) {
    return false;
  }

  const artist = song[0].artist['#text'];
  const album = song[0].album['#text'];
  const { name, url } = song[0];
  const image = song[0].image[0]['#text'];

  return { artist, album, name, url, image };
};

const getCurrentSong = data =>
  data.filter(song => {
    if ('@attr' in song) {
      return song['@attr'].nowplaying === 'true';
    }
    return false;
  });

getMusicData(endpoint)
  .then(response => getCurrentSong(response.recenttracks.track))
  .then(currentSong => handleSongMeta(currentSong))
  .then(songObj => handleSongBar(songObj));
