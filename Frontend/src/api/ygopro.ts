import type { Card } from "../types";
export interface YGOPROResponse {
  data: Card[];
}

export async function fetchAllCards(): Promise<YGOPROResponse> {
  const response = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
  if (!response.ok) throw new Error("Failed to fetch cards");
  return response.json() as Promise<YGOPROResponse>;
}
