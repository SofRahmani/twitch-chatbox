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
              text: "Howdy! My name is Bill and I am here to serve Kappa",
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
              'Howdy! My name is Bill and I am here to serve <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">',
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
  if (data.text.startsWith("!") && hideCommands === "yes") return;
  if (ignoredUsers.indexOf(data.nick) !== -1) return;
  addMessage(data, renderedText);
});

function addMessage(data, message) {
  tchat.insertAdjacentHTML(
    "beforeend" /*html*/,
    `<div id="message-${data.msgId}" class="message" data-sender="${data.userId}">
      ${message}
    </div>`
  );
}
