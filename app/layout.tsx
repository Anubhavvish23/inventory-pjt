import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ClientProviders } from '@/components/layout/client-providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InventoryPro - Inventory Management System',
  description: 'Professional inventory management system for tracking equipment and assets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar />
              <div className="flex-1 flex flex-col lg:ml-64">
                <Header />
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
            </div>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
