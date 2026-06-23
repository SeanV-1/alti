export interface Beverage {
  id: string;
  name: string;
  flavorGroup: string;
  tagline: string;
  price: number;
  volume: string;
  description: string;
  activeIngredients: string[];
  sensoryNotes: string;
  colorAccent: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  flavorGroup?: string;
  isCustom?: boolean;
  customFormula?: CustomFormula;
}

export interface CustomFormula {
  name: string;
  tagline: string;
  sensoryDescription: string;
  adaptationReport: string;
  compositionMetrics: {
    earthiness: number;
    citrus: number;
    herbal: number;
    sweetness: number;
  };
  foodPairing: string;
}
