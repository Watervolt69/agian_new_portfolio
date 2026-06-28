
import TextPage from "./pages/TextPage";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";
import Hero from "./pages/HeroPage";
import Navbar from "@/components/NavBar";


const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <TextPage />
      <Page3 /> 
      <Page4 />
    </div>
  );
};

export default App;