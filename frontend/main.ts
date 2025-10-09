interface DraftOption {
  id: number;
  name: string;
  card_images?: { image_url_small?: string }[];
}

let draft: DraftOption[][] = [];
let currentPick = 0;
const deck: DraftOption[] = [];

const draftContainer = document.getElementById("draft-container")!;
const deckCounter = document.getElementById("deck-counter")!;

async function fetchDraft() {
  try {
    const res = await fetch("/api/draft");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    draft = data.draft;
    showNextPick();
  } catch (err) {
    console.error("Failed to fetch draft:", err);
    draftContainer.innerHTML = "<p>Cannot load draft</p>";
  }
}

function showNextPick() {
  draftContainer.innerHTML = "";

  if (currentPick >= draft.length) {
    draftContainer.innerHTML = "<p>Deck complete!</p>";

    const deckListDiv = document.createElement("div");
    deckListDiv.className = "deck-list";
    const deckTitle = document.createElement("h3");
    deckTitle.textContent = "Your Drafted Deck:";
    deckListDiv.appendChild(deckTitle);
    const deckUl = document.createElement("ul");
    deck.forEach((card) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      img.src = card.card_images?.[0]?.image_url_small ?? "/placeholder.png";
      img.alt = card.name;
      img.style.width = "40px";
      img.style.verticalAlign = "middle";
      li.appendChild(img);
      li.appendChild(document.createTextNode(" " + card.name));
      deckUl.appendChild(li);
    });
    deckListDiv.appendChild(deckUl);
    draftContainer.appendChild(deckListDiv);
    return;
  }

  const options = draft[currentPick];
  options.forEach((card, idx) => {
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
    draftContainer.appendChild(cardDiv);
  });

  const counterHeading = deckCounter.querySelector("h2");
  if (counterHeading) {
    counterHeading.textContent = `Your Deck (${deck.length}/40)`;
  }
}

function pickCard(card: DraftOption) {
  deck.push(card);
  currentPick++;
  showNextPick();
}

fetchDraft();
