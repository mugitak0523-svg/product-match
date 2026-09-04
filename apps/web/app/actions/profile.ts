"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const optionalUrl = z.union([z.literal(""), z.string().url().max(500)]).transform((value) => value || null);
const profileSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(30).regex(/^[a-z0-9][a-z0-9_-]*$/),
  displayName: z.string().trim().min(1).max(80),
  avatarUrl: optionalUrl,
  bio: z.string().trim().max(500),
  websiteUrl: optionalUrl,
  xHandle: z.string().trim().max(31).regex(/^@?[A-Za-z0-9_]*$/).transform((value) => value.replace(/^@/, "")),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
});

export async function updateProfile(formData: FormData) {
  const locale = formData.get("locale") === "ja" ? "ja" : "en";
  const parsed = profileSchema.safeParse({
    username: formData.get("username"), displayName: formData.get("displayName"), avatarUrl: formData.get("avatarUrl"),
    bio: formData.get("bio"), websiteUrl: formData.get("websiteUrl"), xHandle: formData.get("xHandle"),
    githubUrl: formData.get("githubUrl"), linkedinUrl: formData.get("linkedinUrl"),
  });
  if (!parsed.success) redirect(`/${locale}/dashboard/profile?notice=invalid-input`);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);
  const { error } = await supabase.from("profiles").update({
    username: parsed.data.username, display_name: parsed.data.displayName, avatar_url: parsed.data.avatarUrl,
    bio: parsed.data.bio || null, website_url: parsed.data.websiteUrl, x_handle: parsed.data.xHandle || null,
    github_url: parsed.data.githubUrl, linkedin_url: parsed.data.linkedinUrl,
  }).eq("id", user.id);
  if (error) redirect(`/${locale}/dashboard/profile?notice=profile-update-failed`);
  redirect(`/${locale}/dashboard/profile?notice=profile-updated`);
}
