export interface Card {
  id: number;
  name: string;
  type: string;
  desc: string;
  card_images: { image_url: string }[];
}
