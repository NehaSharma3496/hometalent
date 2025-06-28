import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../assets/websiteAssets/css/main-style.css'; // ✅ Main website styles
import Header from '../../components/websitecomponents/Header'; // ✅ Website header
import Footer from '../../components/websitecomponents/Footer'; // ✅ Website footer

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
