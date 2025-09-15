export interface YGOCard {
  id: number;
  name: string;
  desc: string;
  card_images: { image_url: string }[];
}

export interface YGOCardsResponse {
  data: YGOCard[];
}
