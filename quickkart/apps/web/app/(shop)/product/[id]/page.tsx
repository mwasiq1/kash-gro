import { fetchApi } from "../../../../lib/api";
import ProductDetailContent from "./ProductDetailContent";
import { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data: product } = await fetchApi(`/products/${params.id}`);
    return {
      title: `${product.name} | KashGro`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "Product Not Found | KashGro",
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  try {
    const { data: product } = await fetchApi(`/products/${params.id}`);

    if (!product) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F4F6FA]">
          <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Product not found</h2>
        </div>
      );
    }

    return <ProductDetailContent product={product} />;
  } catch (error) {
    console.error("Failed to load product:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F4F6FA]">
        <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Something went wrong</h2>
        <p className="text-[#666666]">Please try again later.</p>
      </div>
    );
  }
}
