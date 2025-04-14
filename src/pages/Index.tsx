
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <p className="text-xl text-gray-700 dark:text-gray-300 animate-fade-in">
          Klikni na tlačítko pro nahrání souborů
        </p>
        <FileUpload />
      </main>
      <Footer />
    </div>
  );
}

export default Index;
