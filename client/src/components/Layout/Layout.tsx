// src/components/Layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />  {/* This renders the matched route component */}
      <Footer />
    </>
  );
};

export default Layout;
