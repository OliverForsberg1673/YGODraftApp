import { useEffect, useState } from "react";

interface CardImage {
  image_url: string;
}

interface Card {
  _id: string;
  id: number;
  name: string;
  desc: string;
  card_images: CardImage[];
}

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/cards/random")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cards:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading cards...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Random Cards</h1>
      <div style={{ display: "flex", gap: "2rem" }}>
        {cards.map((card) => (
          <div
            key={card._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              maxWidth: "250px",
            }}
          >
            <h2>{card.name}</h2>
            <img
              src={card.card_images[0]?.image_url}
              alt={card.name}
              style={{ width: "100%" }}
            />
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
