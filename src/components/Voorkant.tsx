import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import AboutSection from "@/components/AboutSection";
import InteriorGallery from "@/components/InteriorGallery";
import Amenities from "@/components/Amenities";
import Surroundings from "@/components/Surroundings";
import Reviews from "@/components/Reviews";
import BookingSection from "@/components/BookingSection";
import VraagSection from "@/components/VraagSection";
import Footer from "@/components/Footer";
import type { Taal } from "@/i18n/talen";

// De voorkant van de site, in elke taal hetzelfde opgebouwd
export default function Voorkant({ taal }: { taal: Taal }) {
  return (
    <>
      <Header taal={taal} />
      <main className="voorkant-secties flex-1">
        <Hero taal={taal} />
        <Highlights taal={taal} />
        <AboutSection taal={taal} />
        <InteriorGallery taal={taal} />
        <Amenities taal={taal} />
        <Surroundings taal={taal} />
        <Reviews taal={taal} />
        <BookingSection taal={taal} />
        <VraagSection taal={taal} />
      </main>
      <Footer taal={taal} />
    </>
  );
}
