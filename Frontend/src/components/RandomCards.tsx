import { useEffect, useState } from "react";
import { fetchAllCards } from "../api/ygopro";
import type { Card } from "../types";

export default function RandomCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCards()
      .then((data) => {
        const allCards: Card[] = data.data;

        const randomCards = allCards
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setCards(randomCards);
        setLoading(false);
      })

      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
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
            src={card.card_images[0].image_url}
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
