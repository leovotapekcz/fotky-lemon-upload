
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <FileUpload />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
