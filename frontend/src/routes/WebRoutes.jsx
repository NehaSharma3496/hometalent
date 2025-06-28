import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from '../layouts/websitelayout/MainLayout';

import Home from '../pages/website/Home';
import About from '../pages/website/About';
import Contact from '../pages/website/Contact';
import Gallery from '../pages/website/Gallery';
import Registration from '../auth/Registration';


const WebRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/gallery" element={<Gallery />} />
   
    <Route path="/registration" element={<Registration />} />
  </Route>
);

export default WebRoutes;