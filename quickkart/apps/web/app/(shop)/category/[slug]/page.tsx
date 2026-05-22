import CategoryClient from "../../../../components/product/CategoryClient";
import { fetchApi } from "../../../../lib/api";
import { notFound } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string | null;
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 1. Fetch categories to find the one matching the slug
  let categories: Category[] = [];
  try {
    const res = await fetchApi("/categories");
    categories = res.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  // 2. Fetch products for this category
  let products = [];
  try {
    const res = await fetchApi(`/products?categoryId=${category.id}&limit=100`);
    products = res.data || [];
  } catch (error) {
    console.error("Failed to fetch products for category:", error);
  }

  return <CategoryClient categoryName={category.name} products={products} />;
}
