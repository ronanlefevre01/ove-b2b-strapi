// scripts/import-products.js
import fs from "fs";
import path from "path";

// Variables d'env attendues
const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/+$/,''); // sans slash final
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;                 // API Token Admin (Full Access)
const INPUT = process.env.INPUT || "./ove_strapi_products_grouped_39ht.json";

// fetch est natif en Node 18+ (pas besoin de node-fetch)
async function api(pathUrl, options = {}) {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    throw new Error("STRAPI_URL et STRAPI_TOKEN sont requis.");
  }
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
    throw new Error(`HTTP ${res.status} ${res.statusText} on ${pathUrl} -> ${text.slice(0,400)}`);
  }
  return res.json();
}

async function findOneBySlug(contentType, slug) {
  const q = encodeURIComponent(`filters[slug][$eq]=${slug}`);
  const data = await api(`/api/${contentType}?${q}&pagination[limit]=1`);
  return data?.data?.[0] || null;
}

async function ensureBrand(brand_slug) {
  if (!brand_slug) return null;
  const found = await findOneBySlug("brands", brand_slug);
  if (found) return found.id;
  const created = await api(`/api/brands`, {
    method: "POST",
    body: JSON.stringify({ data: { name: brand_slug, slug: brand_slug } }),
  });
  return created.data.id;
}

// Optionnel: ne crée pas les catégories, juste les retrouve si elles existent (sinon null)
async function ensureCategory(category_slug) {
  if (!category_slug) return null;
  const found = await findOneBySlug("categories", category_slug);
  return found ? found.id : null;
}

function toVariantPayload(v) {
  return {
    color_code: v.color_code || "",
    color_label: v.color_label || "",
    size_a: v.size_a ?? null,
    size_d: v.size_d ?? null,
    sku: v.sku || null,
    stock: v.stock ?? null,
    ean: v.barcode || v.ean || null,
    price_ht: v.price_ht ?? 39.0,
    // on stocke les URLs Cloudinary directement
    image_urls: Array.isArray(v.images) ? v.images : Array.isArray(v.image_urls) ? v.image_urls :
      (typeof v.images === "string" && v.images.includes(";"))
        ? v.images.split(";").map(s => s.trim()).filter(Boolean)
        : (typeof v.images === "string" && v.images.startsWith("http"))
        ? [v.images.trim()]
        : [],
  };
}

async function run() {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("❌ STRAPI_URL et STRAPI_TOKEN sont requis (env).");
    process.exit(1);
  }

  const abs = path.resolve(INPUT);
  const raw = fs.readFileSync(abs, "utf-8");
  const products = JSON.parse(raw);

  for (const p of products) {
    try {
      const brandId = await ensureBrand(p.brand_slug);
      const categoryId = await ensureCategory(p.category_slug); // seulement si Product a 'category' côté schéma

      const variants = (p.variants || []).map(toVariantPayload);

      const payload = {
        title: p.title,
        slug: p.slug,
        type: p.type || "frame",
        price_ht: p.price_ht ?? 39.0,
        ...(brandId ? { brand: brandId } : {}),
        // n’activer que si ton Product a bien un champ 'category' manyToOne
        ...(categoryId ? { category: categoryId } : {}),
        variants,
      };

      const created = await api(`/api/products`, {
        method: "POST",
        body: JSON.stringify({ data: payload }),
      });

      console.log(`✅ ${p.title} -> id ${created.data.id} (${variants.length} variantes)`);
    } catch (e) {
      console.error(`❌ ${p.title}: ${e.message}`);
    }
  }

  console.log("🎉 Import terminé.");
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
