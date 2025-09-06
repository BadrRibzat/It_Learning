// src/App.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import api from './utils/api';
import './App.css';

const App = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;
