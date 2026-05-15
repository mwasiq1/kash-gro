import HomeClient from "../../components/home/HomeClient";
import { fetchApi } from "../../lib/api";

async function getCategories() {
  try {
    const { data } = await fetchApi("/categories", { next: { revalidate: 300 } } as any);
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

async function getProducts() {
  try {
    const { data } = await fetchApi("/products?limit=60", { next: { revalidate: 60 } } as any);
    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return <HomeClient categories={categories} allProducts={products} />;
}
