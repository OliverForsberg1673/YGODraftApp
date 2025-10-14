export interface Card {
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
