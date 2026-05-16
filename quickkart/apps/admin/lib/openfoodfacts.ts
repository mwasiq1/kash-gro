export interface ScannedProduct {
  name: string;
  brand?: string;
  unit?: string;
  categoryName: string;
  imageUrl?: string;
  barcode: string;
}

const CATEGORY_MAPPING: Record<string, string> = {
  "en:dairy": "Dairy & Breakfast",
  "en:breakfast": "Dairy & Breakfast",
  "en:snacks": "Snacks & Munchies",
  "en:beverages": "Cold Drinks & Juices",
  "en:frozen-foods": "Instant Food",
  "en:fruits": "Fruits & Vegetables",
  "en:vegetables": "Fruits & Vegetables",
  "en:bakery": "Bakery & Biscuits",
  "en:household": "Household & Cleaning",
  "en:hygiene": "Personal Care",
  "en:beauty": "Personal Care",
};

export async function lookupBarcode(barcode: string): Promise<ScannedProduct | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    const p = data.product;

    // Name priority: product_name_en -> product_name -> abbreviated_product_name
    let name = p.product_name_en || p.product_name || p.abbreviated_product_name || "Unknown Product";
    
    // Brand: first from comma separated list
    const brand = p.brands ? p.brands.split(",")[0].trim() : "";
    
    // Combine brand + name if brand is not already in name
    if (brand && !name.toLowerCase().includes(brand.toLowerCase())) {
      name = `${brand} ${name}`;
    }

    // Unit/Quantity
    const unit = p.quantity || p.unit || "1 unit";

    // Category mapping
    let categoryName = "Snacks & Munchies"; // Default
    if (p.categories_tags) {
      for (const tag of p.categories_tags) {
        if (CATEGORY_MAPPING[tag]) {
          categoryName = CATEGORY_MAPPING[tag];
          break;
        }
      }
    }

    return {
      name,
      brand,
      unit,
      categoryName,
      imageUrl: p.image_url || p.image_front_url || p.image_small_url,
      barcode,
    };
  } catch (error) {
    console.error("Open Food Facts Error:", error);
    return null;
  }
}
