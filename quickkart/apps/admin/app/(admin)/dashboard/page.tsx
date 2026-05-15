import { BarChart3, Package, ShoppingBag, Users } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Total Revenue", value: "₹0", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: "0", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Products", value: "0", icon: Package, color: "text-[#F8C200]", bg: "bg-[#FFF9E6]" },
    { label: "Active Users", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">Last 30 days</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-[#1C1C1C]">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-[#1C1C1C]">Recent Activity</h3>
          <button className="text-sm font-bold text-[#F8C200] hover:underline">View All</button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-gray-200" />
          </div>
          <p className="text-gray-500 font-medium">No activity to show yet.</p>
        </div>
      </div>
    </div>
  );
}
