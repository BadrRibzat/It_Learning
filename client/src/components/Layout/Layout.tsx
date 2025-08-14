// src/components/Layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{
        minHeight: 'calc(100vh - 140px)', // Full height minus navbar + footer
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '2rem 0',
      }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
