import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from '../layouts/websitelayout/MainLayout';

import Home from '../pages/website/Home';
import About from '../pages/website/About';
import Contact from '../pages/website/Contact';
import Gallery from '../pages/website/Gallery';
import Registration from '../auth/Registration';
import Category from '../pages/website/category/Category';
import Blog from '../pages/website/weddingVogue/Blog';


const WebRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/gallery" element={<Gallery />} />
    <Route path="/:slug" element={<Category/>}/>
    <Route path='/blog' element={<Blog/>}/>
   
  </Route>
);

export default WebRoutes;