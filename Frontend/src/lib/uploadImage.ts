// src/lib/uploadImage.ts

import { supabase } from "#lib/supabase"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_MB = 5

export async function uploadImage(file: File, folder = "general") {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF files are allowed.")
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File must be under ${MAX_SIZE_MB}MB.`)
  }

  const ext = file.name.split(".").pop()
  const filename = `${folder}/${crypto.randomUUID()}.${ext}`

  const { data, error } = await supabase.storage
    .from("images")
    .upload(filename, file, {
      upsert: false,
      contentType: file.type,
    })
  console.log("Upload response:", { data, error })
  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from("images")
    .getPublicUrl(data.path)

  return publicUrl
}