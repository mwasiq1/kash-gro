export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white">
      <h1 className="text-4xl font-black text-[#1C1C1C] mb-4">404</h1>
      <h2 className="text-xl font-bold text-gray-600 mb-4">Storefront Page Not Found</h2>
      <p className="text-gray-500 max-w-md">We couldn't find the page you were looking for. It might have been removed or the link is incorrect.</p>
    </div>
  );
}
