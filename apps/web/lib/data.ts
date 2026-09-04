import { createClient } from "@/lib/supabase/server";
import type { Arena, Match, Product } from "@/lib/types";

const matchSelect = `*, product_a:products!matches_product_a_id_fkey(id,name,slug,url,tagline,description,logo_url,category), product_b:products!matches_product_b_id_fkey(id,name,slug,url,tagline,description,logo_url,category)`;

export async function getActiveMatches(limit = 12): Promise<Match[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("matches_public").select(matchSelect).in("status", ["active", "overtime"]).order("ends_at").limit(limit);
  return (data ?? []) as unknown as Match[];
}

export async function getMatch(id: string): Promise<Match | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("matches_public").select(matchSelect).eq("id", id).maybeSingle();
  return data as unknown as Match | null;
}

export async function getArenas(limit = 20): Promise<Arena[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("arenas").select("*, champion:products!arenas_champion_product_id_fkey(id,name,slug,url,tagline,description,logo_url,category)").order("arena_number", { ascending: false }).limit(limit);
  return (data ?? []) as unknown as Arena[];
}

export async function getProducts(limit = 12): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as Product[];
}
