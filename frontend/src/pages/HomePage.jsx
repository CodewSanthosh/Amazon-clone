import React from 'react'
import Header from "../components/Layout/Header";
import Hero from '../components/Route/Hero/Hero';
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Footer from "../components/Layout/Footer";
import GreenImpactStats from "../components/ReLife/GreenImpactStats";
import HowItWorks from "../components/ReLife/HowItWorks";
import TrustBanner from "../components/ReLife/TrustBanner";

const HomePage = () => {
    return (
        <div>
            <Header activeHeading={1} />
            <Hero />
            <GreenImpactStats />
            <HowItWorks />
            <TrustBanner />
            <Categories />
            <BestDeals />
            <FeaturedProduct />
            <Footer />
        </div>
    )
}

export default HomePage
