export interface YGOCard {
  id: number;
  name: string;
  desc: string;
  type?: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  archetype?: string;
  card_images: { id: number; image_url: string }[];
  [key: string]: any;
}

export interface YGOCardsResponse {
  data: Record<string, YGOCard>;
}
