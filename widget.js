let hideCommands = "no";
let ignoredUsers = [];

const tchat = document.querySelector("#tchat");

window.addEventListener("onEventReceived", function (obj) {
  let data = obj.detail.event.data;
  let renderedText = obj.detail.event.renderedText;

  if (obj.detail.event.listener === "widget-button") {
    if (obj.detail.event.field === "testMessage") {
      let emulated = new CustomEvent("onEventReceived", {
        detail: {
          listener: "message",
          event: {
            service: "twitch",
            data: {
              time: Date.now(),
              tags: {
                "badge-info": "",
                badges: "moderator/1,partner/1",
                color: "#5B99FF",
                "display-name": "StreamElements",
                emotes: "25:46-50",
                flags: "",
                id: "43285909-412c-4eee-b80d-89f72ba53142",
                mod: "1",
                "room-id": "85827806",
                subscriber: "0",
                "tmi-sent-ts": "1579444549265",
                turbo: "0",
                "user-id": "100135110",
                "user-type": "mod",
              },
              nick: "WillowDono",
              userId: "100135110",
              displayName: "WillowDono",
              displayColor: "#5B99FF",
              badges: [
                {
                  type: "moderator",
                  version: "1",
                  url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                  description: "Moderator",
                },
                {
                  type: "partner",
                  version: "1",
                  url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                  description: "Verified",
                },
              ],
              channel: "WillowDono",
              text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui repellat saepe tenetur laudantium, voluptate sapiente consequuntur perferendis enim eum accusamus aut, magni nemo reprehenderit a, nobis ex similique necessitatibus beatae! Odio, fugit quia. Omnis et velit tempore soluta exercitationem illo eum nisi repellendus adipisci Incidunt reprehenderit ipsam ipsum voluptates maxime molestias corrupti minima veritatis doloribus nemo dolor reiciendis aperiam minus est illum provident repudiandae!",
              isAction: !1,
              emotes: [
                {
                  type: "twitch",
                  name: "Kappa",
                  id: "25",
                  gif: !1,
                  urls: {
                    1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                    2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                    4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0",
                  },
                  start: 46,
                  end: 50,
                },
              ],
              msgId: "43285909-412c-4eee-b80d-89f72ba53142",
            },
            renderedText:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui repellat saepe tenetur laudantium, voluptate sapiente consequuntur perferendis enim eum accusamus aut, magni nemo reprehenderit a, nobis ex similique necessitatibus beatae! Odio, fugit quia. Omnis et velit tempore soluta exercitationem illo eum nisi repellendus adipisci Incidunt reprehenderit ipsam ipsum voluptates maxime molestias corrupti minima veritatis doloribus nemo dolor reiciendis aperiam minus est illum provident repudiandae! GG',
          },
        },
      });
      window.dispatchEvent(emulated);
    }
    return;
  }

  if (obj.detail.listener === "delete-message") {
    const msgId = obj.detail.event.msgId;
    document.querySelectorAll(`#message-${msgId}`).forEach((element) => element.remove());
    return;
  } else if (obj.detail.listener === "delete-messages") {
    const sender = obj.detail.event.userId;
    document
      .querySelectorAll(`.message[data-sender=${sender}]`)
      .forEach((element) => element.remove());
    return;
  }

  if (obj.detail.listener !== "message") return;
  addMessage(data, renderedText);
});

function addMessage(data, message) {
  const color = data.displayColor || `#${md5(data.displayName).subtr(26)}`;

  const hsl = hexToHSL(color);
  const luminosityDarker = Math.max(0, hsl.l - 10);
  const darkerColor = HSLToString({ h: hsl.h, s: hsl.s, l: luminosityDarker });
  const lighterColor = lightenColor(color, 0.1);

  const badges = data.badges.reduce((acc, badge) => {
    return acc + /*html*/ `<img src="${badge.url}" class="badge" />`;
  }, "");

  const messageToLowerCase = message.toLowerCase();

  let extraClass = "";
  if (message.trim().includes("?")) {
    extraClass = "has-question";
  } else if (messageToLowerCase.includes(" gg ") || messageToLowerCase.includes(" gg!") || messageToLowerCase.includes(" gg") || messageToLowerCase.includes("gg")) {
    extraClass = "has-gg";
  } else if (message.trim().includes("!")) {
    extraClass = "has-exclamation";
  }

  tchat.insertAdjacentHTML(
    "beforeend", /*html*/
    `
    <div id="message-${data.msgId}" class="message" data-sender="${data.userId}" style="--color: ${color}; --darker-color: ${darkerColor}; --lighter-color: ${lighterColor}">
      <div class="meta">
      <div class="name">${data.displayName}</div>
        <div class="badges">${badges}</div>
      </div>
      <div class="content ${extraClass}">
        ${message}
        <span class="decoration"></span>
      </div>
    </div>
    `
  );
}

function hexToHSL(hex) {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;

  if (delta !== 0) {
    if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  let l = (cmax + cmin) / 2;
  let s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

function HSLToString({ h, s, l }) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function lightenColor(hex, factor = 0.1) {
  // Supprime le caractère '#' si présent
  hex = hex.replace(/^#/, "");

  // Développe la notation courte (ex: "abc" -> "aabbcc")
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Convertir les composantes hex en valeurs numériques
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Mélange avec du blanc (255, 255, 255)
  // Si factor = 0 -> couleur 100% blanche
  // Si factor = 1 -> couleur d'origine
  const newR = Math.round((1 - factor) * 255 + factor * r);
  const newG = Math.round((1 - factor) * 255 + factor * g);
  const newB = Math.round((1 - factor) * 255 + factor * b);

  // Fonction utilitaire pour convertir un nombre en hexadécimal sur deux chiffres
  const toHex = (c) => {
    const hexVal = c.toString(16);
    return hexVal.length === 1 ? "0" + hexVal : hexVal;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}
