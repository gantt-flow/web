import Header from "@/components/mainLayout/header"; 
import Footer from "@/components/mainLayout/footer"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
