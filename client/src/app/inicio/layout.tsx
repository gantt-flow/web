import Header from '@/components/header';
import Sidebar from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className='h-screen flex flex-col'>
      <header className='h-16'>
        <Header/>
      </header>

      <main className="flex flex-row flex-1">
          <Sidebar />
          {children}
      </main>
        
        
    </section>);
  
}