import Header from "@/components/mainLayout/header"; // Asegúrate que la ruta sea correcta
import Footer from "@/components/mainLayout/footer"; // Asegúrate que la ruta sea correcta

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
