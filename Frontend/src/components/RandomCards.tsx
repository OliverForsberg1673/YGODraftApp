import { useEffect, useState } from "react";

interface CardImage {
  image_url: string;
}

interface Card {
  _id: string;
  id: number;
  name: string;
  desc: string;
  type: string;
  card_images: CardImage[];
}

export default function RandomCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/cards/random")
      .then((res) => res.json())
      .then((data: Card[]) => {
        setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cards:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading cards...</p>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "20px",
        flexWrap: "wrap",
      }}
    >
      {cards.map((card) => (
        <div
          key={card._id}
          style={{
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            width: "200px",
          }}
        >
          <img
            src={card.card_images[0]?.image_url}
            alt={card.name}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <h2 style={{ fontWeight: "bold", marginBottom: "6px" }}>
            {card.name}
          </h2>
          <p style={{ fontSize: "14px", color: "#555" }}>{card.type}</p>
        </div>
      ))}
    </div>
  );
}
