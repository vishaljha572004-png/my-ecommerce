import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-section">
      <Navbar />
      <main className="flex-grow pt-16 sm:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
