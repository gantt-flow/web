import Header from '@/components/header';
import Sidebar from "@/components/sidebar";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
        <Sidebar />
        
        <div className="flex flex-1 flex-col overflow-hidden">
            <header className="flex-shrink-0">
              <Header />
            </header>

            <main className="overflow-y-auto">
                {children} 
            </main>
        </div>
    </div>
  );
}