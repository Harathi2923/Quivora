import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import Mission from "../../components/home/Mission";
import WhyChoose from "../../components/home/WhyChoose";
import LearningJourney from "../../components/home/LearningJourney";
import LearningCategories from "../../components/home/LearningCategories";
import Contact from "../../components/home/Contact";
import Footer from "../../components/layout/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Mission />
      <WhyChoose />
      <LearningJourney />
      <LearningCategories />
      <Contact/>
      <Footer/>
    </>
  );
};

export default Home;