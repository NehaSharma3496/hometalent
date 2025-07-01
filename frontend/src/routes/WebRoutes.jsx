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
import Faq from '../pages/website/Faq';
import PrivacyPolicy from '../pages/website/PrivacyPolicy';
import TermsCondition from '../pages/website/TermsCondition';
import CategoryDetail from '../pages/website/category/CategoryDetail';
import BlogDetail from '../pages/website/weddingVogue/BlogDetail';

const categories = [
  { name: "Cutlery", slug: "cutlery" },
  { name: "Cosmetics", slug: "cosmetics" },
  { name: "Dance Tutor, Choreographer", slug: "dance-tutor" },
  { name: "Yoga Instructor", slug: "yoga-instructor" },
  { name: "Education Tutor", slug: "education-tutor" },
  { name: "Music Teacher", slug: "music-teacher" },
  { name: "Art & Craft Teacher", slug: "art-craft-teacher" },
  { name: "Nursery & Pottery", slug: "nursery-pottery" },
  { name: "Art Work", slug: "art-work" },
  { name: "Babysitter or Pet Care", slug: "babysitter" },
  { name: "Fabric Painting", slug: "fabric-painting" },
  { name: "Canvas Painting", slug: "canvas-painting" },
  { name: "Mehandi Art", slug: "mehandi-art" },
  { name: "Catering", slug: "catering" },
  { name: "Cook/Chef on Call", slug: "cook-on-call" },
  { name: "Bakery Item", slug: "bakery-item" },
  { name: "Food (Namkeen, Sweets, Snacks)", slug: "food" },
  { name: "Gift & Packaging", slug: "gift-packaging" },
  { name: "Anchor", slug: "anchor" },
  { name: "Clothes", slug: "clothes" },
  { name: "Jewellery", slug: "jewellery" },
  { name: "Beauty Services / Home Salon", slug: "beauty-services" },
  { name: "Music Artist", slug: "music-artist" },
];

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
    <Route path="/categorydetail/:slug" element={<CategoryDetail/>}/>
    <Route path='/blogdetail/:id' element={<BlogDetail/>}/>
     <Route path="/:slug" element={<Category categories={categories} />} />
     <Route path="*" element={<Home />} />
  </Route>
);

export default WebRoutes;