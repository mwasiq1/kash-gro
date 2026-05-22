import { fetchApi } from "../../../lib/api";
import Link from "next/link";
import { Grid, ArrowRight } from "lucide-react";
import TopNav from "../../../components/home/TopNav";

interface Category {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  _count?: { products: number };
}

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    const res = await fetchApi("/categories");
    categories = res.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <TopNav />
      <div className="bg-white border-b border-[#E8E8E8] py-4 px-4">
        <h1 className="text-lg font-bold text-[#1C1C1C] flex items-center gap-2">
          <Grid className="w-5 h-5 text-[#F8C200]" />
          All Categories
        </h1>
      </div>

      <main className="p-4 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug || cat.id}`}
              className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-sm hover:shadow-md transition flex flex-col justify-between h-32 group"
            >
              <div>
                <h3 className="font-bold text-sm text-[#1C1C1C] group-hover:text-[#F8C200] transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#999999] mt-1 font-medium">
                  {cat._count?.products ?? 0} items
                </p>
              </div>
              <div className="flex justify-end">
                <div className="w-8 h-8 rounded-full bg-[#F4F6FA] group-hover:bg-[#F8C200] flex items-center justify-center text-[#1C1C1C] transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
