// src/components/Layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main style={{
        minHeight: 'calc(100vh - 140px)',
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
