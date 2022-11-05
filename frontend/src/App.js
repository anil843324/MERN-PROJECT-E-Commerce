import './App.css';
import { useEffect } from 'react';
import Header from './component/layout/Header/Header';
import Footer from './component/layout/Footer/Footer';
import { Routes, Route } from 'react-router-dom';
import WebFonte from 'webfontloader';

function App() {
  useEffect(() => {
    WebFonte.load({
      google: {
        families: ['Robot', 'Drold Sans', 'Chilanka'],
      },
    });
  }, []);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<h1> Home</h1>} />
        <Route path="/product" element={<h1>Product</h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
        <Route path="/about" element={<h1>About</h1>} />
      </Routes>

     <Footer/>
    </>
  );
}

export default App;
