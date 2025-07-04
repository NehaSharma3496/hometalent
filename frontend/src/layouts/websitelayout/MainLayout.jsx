import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/websitecomponents/Header';
import Footer from '../../components/websitecomponents/Footer';

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
