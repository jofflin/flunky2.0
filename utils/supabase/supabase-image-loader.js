export default function supabaseLoader({ src, width, quality }) {
  return `https://vysvyvruffebmllaeuyi.supabase.co/storage/v1/object/public/avatars/${src}?width=${width}&quality=${
    quality || 75
  }`;
}
