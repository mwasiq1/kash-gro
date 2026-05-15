export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F4F6FA]">
      <h1 className="text-4xl font-black text-[#1C1C1C] mb-4">404</h1>
      <h2 className="text-xl font-bold text-gray-600 mb-4">Admin Page Not Found</h2>
      <p className="text-gray-500 max-w-md">The page you are looking for does not exist or has been moved.</p>
    </div>
  );
}
