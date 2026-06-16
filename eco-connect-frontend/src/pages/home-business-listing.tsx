import BusinessListing from "../components/home-business-listing/business-listing";
import HeroSection from "../components/home-business-listing/hero";


const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* importing components */}
      <HeroSection />
      <BusinessListing />
    </div>
  );
};

export default Home;