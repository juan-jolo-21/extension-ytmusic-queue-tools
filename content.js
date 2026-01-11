console.log("Content script activo", window.location.href);

function createMarker() {
  const div = document.createElement("div");
  div.className = "queue-marker";
  return div;
}

// CSS inyectado
const style = document.createElement("style");
style.textContent = `

.song-info {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
}

.song-info-2 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width:60%
}

.added-tools {
  display: flex;

  background: #b9ecb4;
  min-width: 40%;
  height: 100%;
  align-self: stretch;
  height: auto;
  flex-shrink: 0;
}

`;
document.head.appendChild(style);

function restructureSongInfo(item) {
  const songInfo = item.querySelector(".song-info");
  if (!songInfo) return;

  // Evitar hacerlo dos veces
  if (songInfo.querySelector(".song-info-2")) return;

  const title = songInfo.querySelector(".song-title");
  const byline = songInfo.querySelector(".byline-wrapper");

  if (!title || !byline) return;

  // Crear contenedor vertical
  const wrapper = document.createElement("div");
  wrapper.className = "song-info-2";

  wrapper.appendChild(title);
  wrapper.appendChild(byline);

  // Crear contenedor de herramientas
  const tools = document.createElement("div");
  tools.className = "added-tools";

  // Vaciar song-info y reconstruirlo
  songInfo.innerHTML = "";
  songInfo.appendChild(wrapper);
  songInfo.appendChild(tools);
}


function processQueue() {

  const items2 = document.querySelectorAll("ytmusic-player-queue-item");

  items2.forEach(item => {
    restructureSongInfo(item);
  });
}

// Observa cuando YouTube Music crea o cambia la cola
const observer = new MutationObserver(() => {
  processQueue();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
