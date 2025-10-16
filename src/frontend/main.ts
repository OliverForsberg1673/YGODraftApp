interface DraftOption {
  id: number;
  name: string;
  type?: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_images?: {
    image_url?: string;
    image_url_small?: string;
  }[];
}

let draft: DraftOption[][] = [];
let currentPick = 0;
let deck: DraftOption[] = [];

function render() {
  const root = document.getElementById("app");
  if (!root) return;

  if (location.hash === "#/deck") {
    renderDeckPage(root);
  } else if (location.hash === "#/manage-decks") {
    renderManageDecksPage(root);
  } else {
    renderDraftPage(root);
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

function renderDraftPage(root: HTMLElement) {
  root.innerHTML = `
    <h1>Draft Page</h1>
    <button id="reset-draft-btn">Reset Draft</button>
    <div id="draft-container"></div>
    <div id="deck-counter"></div>
    
  `;
  document
    .getElementById("reset-draft-btn")
    ?.addEventListener("click", resetDraft);
  loadDraft();
}

function renderManageDecksPage(root: HTMLElement) {
  root.innerHTML = `
    <h1>Manage Decks</h1>
    <div id="decks-list"></div>
    <a href="#">Back to Draft</a>
  `;
  loadDecks();
}

async function loadDecks() {
  const res = await fetch("/api/decks");
  const decks = await res.json();
  const list = document.getElementById("decks-list");
  if (!list) return;
  list.innerHTML = "";
  decks.forEach((deck: any) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong class="deck-link" data-id="${deck._id}">${deck.name}</strong>
      <button data-id="${deck._id}" class="edit-btn">Edit</button>
      <button data-id="${deck._id}" class="delete-btn">Delete</button>
      <button data-id="${deck._id}" class="show-cards-btn">Show Cards</button>
    `;
    list.appendChild(div);

    div.querySelector(".edit-btn")?.addEventListener("click", () => {
      const nameEl = div.querySelector(".deck-link") as HTMLElement;
      const oldName = nameEl.textContent || "";
      nameEl.outerHTML = `
        <input type="text" class="edit-name-input" value="${oldName}" style="width:120px;">
      `;
      const input = div.querySelector(".edit-name-input") as HTMLInputElement;
      input.focus();

      const editBtn = div.querySelector(".edit-btn") as HTMLButtonElement;
      editBtn.style.display = "none";
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.className = "save-btn";
      saveBtn.onclick = async () => {
        const newName = input.value.trim();
        if (!newName) return;
        await fetch(`/api/decks/${deck._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, cards: deck.cards }),
        });
        loadDecks();
      };
      editBtn.parentNode?.insertBefore(saveBtn, editBtn);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveBtn.click();
      });
    });

    div.querySelector(".delete-btn")?.addEventListener("click", async (e) => {
      const id = (e.target as HTMLButtonElement).dataset.id;
      await fetch(`/api/decks/${id}`, { method: "DELETE" });
      loadDecks();
    });

    div
      .querySelector(".show-cards-btn")
      ?.addEventListener("click", async () => {
        const view = document.getElementById("deck-cards-view");
        if (!view) {
          const newView = document.createElement("div");
          newView.id = "deck-cards-view";
          div.parentElement?.appendChild(newView);
        }
        await showDeckCards(deck._id);
      });
  });
}

async function showDeckCards(deckId: string) {
  const res = await fetch(`/api/decks/${deckId}`);
  if (!res.ok) {
    const view = document.getElementById("deck-cards-view");
    if (view) view.innerHTML = "<p>Deck not found.</p>";
    return;
  }
  const deck = await res.json();
  let view = document.getElementById("deck-cards-view");
  if (!view) {
    view = document.createElement("div");
    view.id = "deck-cards-view";
    document.body.appendChild(view);
  }
  if (!deck.cards || !deck.cards.length) {
    view.innerHTML = "<p>No cards in this deck.</p>";
    return;
  }
  view.innerHTML = `
  <h3>Cards in "${deck.name}"</h3>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    ${deck.cards
      .map(
        (card: any) => `
      <div style="width:100px;text-align:center;">
        <img src="${
          card.card_images?.[0]?.image_url_small ?? "/placeholder.png"
        }" alt="${card.name}" style="width:100px;">
        <div class="deck-card-name">${card.name}</div>
      </div>
    `
      )
      .join("")}
  </div>
`;
}

async function loadDraft() {
  const res = await fetch("/api/draft");
  const data = await res.json();
  draft = data.draft;
  currentPick = 0;
  deck = [];
  renderDraftOptions();
}

async function resetDraft() {
  const res = await fetch("/api/draft/reset", { method: "POST" });
  const data = await res.json();
  draft = data.draft;
  currentPick = 0;
  deck = [];
  renderDraftOptions();
}

function renderDraftOptions() {
  const container = document.getElementById("draft-container");
  const counter = document.getElementById("deck-counter");
  if (!container || !counter) return;

  container.innerHTML = "";
  counter.innerHTML = `<h2>Your Deck (${deck.length}/40)</h2>`;

  if (currentPick >= draft.length) {
    container.innerHTML = `
      <p>Deck complete!</p>
      <form id="save-deck-form">
        <input type="text" id="final-deck-name" placeholder="Deck name" required>
        <button type="submit">Save Deck</button>
      </form>
      <a href="#/manage-decks">Manage Decks</a>
    `;
    document
      .getElementById("save-deck-form")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = (
          document.getElementById("final-deck-name") as HTMLInputElement
        ).value;
        await fetch("/api/decks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, cards: deck }),
        });

        deck = [];
        currentPick = 0;
        window.location.hash = "#/manage-decks";
      });
    return;
  }

  draft[currentPick].forEach((card, idx) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = `card-option card-option-${idx}`;

    const img = document.createElement("img");
    img.src = card.card_images?.[0]?.image_url_small ?? "/placeholder.png";
    img.alt = card.name;

    const name = document.createElement("p");
    name.textContent = card.name;

    cardDiv.appendChild(img);
    cardDiv.appendChild(name);

    cardDiv.addEventListener("click", () => pickCard(card));
    container.appendChild(cardDiv);
  });
}

function pickCard(card: DraftOption) {
  deck.push(card);
  currentPick++;
  renderDraftOptions();
}

function renderDeckPage(root: HTMLElement) {
  root.innerHTML = `
    <h1>Your Deck</h1>
    <a href="#">Back to Draft</a>
    <div id="deck-list"></div>
  `;
  const deckList = document.getElementById("deck-list");
  if (!deckList) return;
  if (deck.length === 0) {
    deckList.innerHTML = "<p>No cards in deck.</p>";
    return;
  }
  deck.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card-option";
    cardDiv.innerHTML = `
      <img src="${
        card.card_images?.[0]?.image_url_small ?? "/placeholder.png"
      }" alt="${card.name}">
      <p>${card.name}</p>
    `;
    deckList.appendChild(cardDiv);
  });
}
