const username = "okasin";
const apiKey = "5d87c532b5937f7417f617f28f799cf3";
const endpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

fetch(endpoint)
  .then((response) => response.json())
  .then((data) => {
    const track = data.recenttracks.track[0];
    const trackName = track.name;
    const artist = track.artist["#text"];
    const nowPlaying = track["@attr"]?.nowplaying === "true";

    const albumImage = track.image?.[2]?.["#text"] || "";

    const output = `
  <div style="display: flex; align-items: flex-start; justify-content: space-between; width: 100%;">
    <div style="text-align: left; padding-right: 6px; flex: 1;">
      ${trackName}<br>— ${artist}
    </div>
    ${albumImage ? `<img src="${albumImage}" alt="Album cover" style="width:48px; height:48px; border-radius:4px; flex-shrink: 0;">` : ""}
  </div>
`;

    document.getElementById("lastfm-track").innerHTML = output;
  })
  .catch((error) => {
    console.error("Error fetching Last.fm data:", error);
    document.getElementById("lastfm-track").innerText = "Unable to load track.";
  });
