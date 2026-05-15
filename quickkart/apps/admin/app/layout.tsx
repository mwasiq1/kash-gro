import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import AdminGuardWrapper from './AdminGuardWrapper'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AdminGuardWrapper>
            {children}
          </AdminGuardWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
