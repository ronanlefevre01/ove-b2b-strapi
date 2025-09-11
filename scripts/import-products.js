// scripts/import-products.js
import fs from "fs";
import path from "path";

// === ENV attendues ===
// STRAPI_URL   : https://ove-b2b-strapi.onrender.com (sans slash final ou avec, on normalise)
// STRAPI_TOKEN : Admin API Token (Full access)
// INPUT        : chemin du JSON groupé => par défaut ./data/ove_strapi_products_grouped_39ht.json

const STRAPI_URL = (process.env.STRAPI_URL || "").replace(/\/+$/, "");
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || "";
const INPUT = process.env.INPUT || "./data/ove_strapi_products_grouped_39ht.json";

if (!STRAPI_URL || !STRAPI_TOKEN) {
  console.error("❌ Il faut définir STRAPI_URL et STRAPI_TOKEN.");
  process.exit(1);
}

async function api(pathUrl, options = {}) {
  const url = `${STRAPI_URL}${pathUrl}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText} on ${pathUrl} -> ${text.slice(0, 400)}`);
  }
  return res.json();
}

async function findOneBySlug(contentType, slug) {
  // /api/{ct}?filters[slug][$eq]=xxx&pagination[limit]=1
  const q = `filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[limit]=1`;
  const data = await api(`/api/${contentType}?${q}`);
  return data?.data?.[0] || null;
}

async function ensureBrand(brandSlug) {
  if (!brandSlug) return null;
  const found = await findOneBySlug("brands", brandSlug);
  if (found) return found.id;

  const created = await api(`/api/brands`, {
    method: "POST",
    body: JSON.stringify({ data: { name: brandSlug, slug: brandSlug } }),
  });
  return created?.data?.id || null;
}

function toVariantPayload(v) {
  // v = { color_code, color_label, size_a, size_d, sku, stock, barcode/ean, images/urls... }
  const imageUrls =
    Array.isArray(v.image_urls)
      ? v.image_urls
      : (typeof v.images === "string" && v.images.includes(";"))
          ? v.images.split(";").map(s => s.trim()).filter(Boolean)
          : (typeof v.images === "string" && v.images.startsWith("http"))
              ? [v.images.trim()]
              : [];

  const payload = {
    color_code : v.color_code || "",
    color_label: v.color_label || "",
    size_a     : v.size_a ?? null,
    size_d     : v.size_d ?? null,
    sku        : v.sku || null,
    stock      : v.stock ?? null,
    ean        : v.ean || v.barcode || null,
  };

  // Si ton composant Variant contient un champ JSON `image_urls`, on l’envoie
  if (imageUrls.length) {
    payload.image_urls = imageUrls;
  }
  return payload;
}

async function run() {
  const abs = path.resolve(INPUT);
  const raw = fs.readFileSync(abs, "utf-8");
  const products = JSON.parse(raw);

  for (const p of products) {
    try {
      // 1) Marque
      const brandId = await ensureBrand(p.brand_slug || p.brand || "");

      // 2) Variants
      const variants = (p.variants || []).map(toVariantPayload);

      // 3) priceTiers -> 39 € HT au palier 1
      const priceTiers = [
        {
          minQty: 1,
          priceHT: 39,
          // tierName: (optionnel si non requis dans ton enum)
        },
      ];

      // 4) Payload Product
      const payload = {
        title: p.title,
        slug : p.slug,
        sku  : p.sku || null,
        type : p.type || "frame",
        // ⚠️ NE PAS mettre `categories` ici (champ inversé, mappedBy côté Category)
        ...(brandId ? { brand: brandId } : {}),
        variants,
        priceTiers,
        isDepositEligible: false,
        newIn: false,
      };

      const created = await api(`/api/products`, {
        method: "POST",
        body: JSON.stringify({ data: payload }),
      });

      console.log(`✅ ${p.title} -> id ${created.data.id} (${variants.length} variantes)`);
    } catch (e) {
      console.error(`❌ ${p.title || p.slug || "?"}: ${e.message}`);
    }
  }

  console.log("🎉 Import terminé.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
