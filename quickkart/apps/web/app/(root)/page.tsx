import HomeClient from "../../components/home/HomeClient";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function getCategories() {
  try {
    const res = await fetch(`${API}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${API}/api/products?limit=60`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return <HomeClient categories={categories} allProducts={products} />;
}
