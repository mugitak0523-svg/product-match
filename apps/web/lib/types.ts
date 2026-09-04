export type Product = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  url: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  category: string;
  pricing_type: string | null;
  status: string;
  is_verified: boolean;
  created_at: string;
};

export type MatchProduct = Pick<Product, "id" | "name" | "slug" | "url" | "tagline" | "description" | "logo_url" | "category">;

export type Match = {
  id: string;
  arena_id: string;
  round_number: number;
  bracket_position: number;
  product_a_id: string;
  product_b_id: string;
  product_a: MatchProduct;
  product_b: MatchProduct;
  winner_product_id: string | null;
  product_a_vote_count?: number;
  product_b_vote_count?: number;
  status: "scheduled" | "active" | "overtime" | "completed" | "cancelled";
  starts_at: string;
  ends_at: string;
  tiebreak_type: string | null;
};

export type Arena = {
  id: string;
  arena_number: number;
  arena_size: number;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  champion_product_id: string | null;
  champion?: MatchProduct | null;
};
