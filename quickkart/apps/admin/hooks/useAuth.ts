import { useAuth as useClerkAuth } from "@clerk/nextjs";

export function useAuth() {
  const clerkAuth = useClerkAuth();
  
  // Default mock auth to true in development unless explicitly disabled
  const isMock = typeof window !== 'undefined' && 
    (localStorage.getItem('mock_auth') === 'true' || localStorage.getItem('mock_auth') !== 'false');
  
  if (isMock) {
    return {
      isSignedIn: true,
      isLoaded: true,
      userId: "mock-clerk-admin-12345",
      getToken: async () => {
        const payload = {
          sub: "mock-clerk-admin-12345",
          email: "admin@kashgro.com",
          name: "Mock Admin User"
        };
        // Use btoa safely in browser, fallback for Node.js
        const encode = (str: string) => {
          if (typeof window !== 'undefined') {
            return window.btoa(str);
          }
          return Buffer.from(str).toString('base64');
        };
        const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const body = encode(JSON.stringify(payload));
        const signature = "signature";
        return `${header}.${body}.${signature}`;
      }
    };
  }
  
  return clerkAuth;
}
