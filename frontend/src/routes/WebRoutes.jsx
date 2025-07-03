import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from '../layouts/websitelayout/MainLayout';
import {categories} from '.././components/websitecomponents/Header'
import Home from '../pages/website/Home';
import About from '../pages/website/About';
import Contact from '../pages/website/Contact';
import Gallery from '../pages/website/Gallery';
import Registration from '../auth/Registration';
import Category from '../pages/website/category/Category';
import Blog from '../pages/website/weddingVogue/Blog';
import Faq from '../pages/website/Faq';
import PrivacyPolicy from '../pages/website/PrivacyPolicy';
import TermsCondition from '../pages/website/TermsCondition';
import CategoryDetail from '../pages/website/category/CategoryDetail';
import BlogDetail from '../pages/website/weddingVogue/BlogDetail';




const WebRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/gallery" element={<Gallery />} />
    <Route path='/blog' element={<Blog/>}/>
    <Route path="/registration" element={<Registration />} />
    <Route path="/faq" element={<Faq/>}/>
    <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
    <Route path="/termscondition" element={< TermsCondition/>}/>
    <Route path="/categorydetail" element={<CategoryDetail/>}/>
    <Route path='/blogdetail' element={<BlogDetail/>}/>
     <Route path="/:slug" element={<Category categories={categories} />} />
    
  </Route>
);

export default WebRoutes;