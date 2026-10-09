import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import AboutSection from "@/components/AboutSection";
import InteriorGallery from "@/components/InteriorGallery";
import Amenities from "@/components/Amenities";
import Surroundings from "@/components/Surroundings";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Highlights />
        <AboutSection />
        <InteriorGallery />
        <Amenities />
        <Surroundings />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
