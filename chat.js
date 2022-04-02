let pronouns = null;

const setup = () => {
  const chatlog = document.querySelector("#log");
  const config = { childList: true };
  const observer = new MutationObserver(onMutation);
  observer.observe(chatlog, config);
  loadPronouns();
};

const onMutation = (mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.addedNodes.length) {
      const addedNodesArray = [...mutation.addedNodes];
      const addedDivs = addedNodesArray.filter(
        (node) => node.nodeName === "DIV"
      );

      if (addedDivs.length) {
        setTimeout(
          () => onNewDivAdded(addedDivs[addedDivs.length - 1].id),
          250
        );
      }
    }
  }
};

function loadPronouns() {
  fetch("https://pronouns.alejo.io/api/pronouns")
    .then((resp) => resp.json())
    .then((resp) => (pronouns = resp));
}

function addPronouns(id) {
  if (pronouns == null) return;

  let container = document.getElementById(id);
  let username = container.getElementsByClassName("name")[0];
  let pronounsContainer = container.getElementsByClassName("pronouns")[0];

  fetch(`https://pronouns.alejo.io/api/users/${username.innerText}`)
    .then((resp) => resp.json())
    .then((resp) => resp[0].pronoun_id)
    .then((pid) => pronouns.find((p) => p.name === pid).display)
    .then((display) => (pronounsContainer.innerText = display));
}

function onNewDivAdded(id) {
  setAvatar(id);
  typewriter(id);
  addPronouns(id);
}

function setAvatar(id) {
  let container = document.getElementById(id);
  if (!container) return;

  let username = container.getElementsByClassName("name")[0];
  let avatar = container.getElementsByClassName("avatar")[0];

  fetch(`https://decapi.me/twitch/avatar/${username.innerText}`)
    .then((response) => response.text())
    .then((url) => (avatar.src = url));
}

function typewriter(id) {
  let container = document.getElementById(id);
  if (!container) return;

  let typewriter = container.getElementsByClassName("typewriter")[0];

  let content = [...container.getElementsByClassName("original")[0].childNodes]
    .map((n) => (n.nodeType === 3 ? [...n.textContent] : [n.cloneNode(true)]))
    .flat();
  let pointer = 0;

  (function writeLetter() {
    if (content.length === pointer) return;

    typewriter.append(content[pointer]);
    pointer++;
    setTimeout(writeLetter, 15);
  })();
}

document.addEventListener("onLoad", setup);
window.onload = setup;
