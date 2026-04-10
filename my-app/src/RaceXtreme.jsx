import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, EffectCoverflow, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AnimatedPage from './components/AnimatedPage';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './RaceXtreme.css';

export default function RaceXtreme() {
  const [cars, setCars] = useState([]);
  const [activeCar, setActiveCar] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fallback images map
  const fallbacks = {
    'Lamborghini': 'https://images.unsplash.com/photo-1544636331-e26879bc47c1?auto=format&fit=crop&q=80&w=1200',
    'Bugatti': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
    'Opel': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
  };

  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/cars')
      .then(res => {
        if (!res.ok) throw new Error('Database connection failed');
        return res.json();
      })
      .then(data => {
        setCars(data);
        if (data.length > 0) setActiveCar(data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching cars:", err);
        setLoading(false);
      });
  }, []);

  const handleCarClick = () => setShowStats(!showStats);
  
  const handleMouseMove = (e) => {
    const images = document.querySelectorAll('.image-area img');
    images.forEach(img => {
      const speed = 0.02;
      const x = (window.innerWidth - e.pageX * speed) / 100;
      const y = (window.innerHeight - e.pageY * speed) / 100;
      img.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.1)`;
    });
  };

  const handleImageError = (e, brand) => {
    e.target.src = fallbacks[brand] || 'https://images.unsplash.com/photo-1492144534655-906c9ef13497?auto=format&fit=crop&q=80&w=1200';
  };

  if (loading) {
    return (
        <div className="racextreme-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'black' }}>
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full"
            />
        </div>
    );
  }

  return (
    <div className="racextreme-container" style={{ overflow: 'hidden' }} onMouseMove={handleMouseMove}>
      <Navbar />
      <AnimatedPage>
          <div className="dynamic-background"></div>
          
          <div className="car-model-selector" style={{ top: '6rem' }}>
            {cars.map((car, idx) => (
              <motion.button 
                key={idx} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`model-btn ${activeCar?._id === car._id ? 'active' : ''}`}
                onClick={() => { setActiveCar(car); setShowStats(false); }}
                style={{ borderColor: activeCar?._id === car._id ? car.colorCode : '', backgroundColor: activeCar?._id === car._id ? car.colorCode : '' }}
              >
                {car.brand}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
              {showStats && activeCar && (
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="stats-overlay active"
                >
                    <h3 className="text-xl font-black italic mb-4">PERFORMANCE HUD</h3>
                    <div className="performance-meter">
                    <div className="meter-circle border-2 border-white/10" style={{ background: `conic-gradient(${activeCar.colorCode} 0%, ${activeCar.colorCode} ${activeCar.performance}%, #111 ${activeCar.performance}%, #111 100%)` }}>
                        <span className="text-2xl font-black">{activeCar.performance}%</span>
                    </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        <StatLine label="TOP SPEED" value={`${activeCar.speed} MPH`} />
                        <StatLine label="MAX POWER" value={`${activeCar.power} KW`} />
                        <StatLine label="0-100 KMPH" value={`${activeCar.acceleration}s`} />
                    </div>
                </motion.div>
              )}
          </AnimatePresence>

          <Swiper
            direction="vertical"
            slidesPerView={1}
            spaceBetween={0}
            mousewheel={true}
            effect="coverflow"
            speed={1500}
            coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[Mousewheel, EffectCoverflow, Pagination]}
            className="racextreme-swiper"
            onSlideChange={(swiper) => {
              setActiveCar(cars[swiper.activeIndex]);
              setShowStats(false);
            }}
          >
            {cars.map((car, idx) => (
              <SwiperSlide key={idx} className="swiper-slide !flex-row !justify-center overflow-visible">
                <div className="slide-bg-shape1" style={{ backgroundColor: car.colorCode, opacity: 0.8 }}></div>
                <div className="slide-bg-shape2"></div>
                
                <div className="racextreme-content !w-full !max-w-7xl px-12">
                  <motion.div 
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="title-area"
                  >
                    <div className="small font-black italic text-white/50 tracking-tighter">THE ULTIMATE</div>
                    <div className="big text-[120px] font-black leading-[0.8] italic uppercase">
                      {car.brand}<br/><span style={{ color: car.colorCode }}>RACING</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, delay: 0.3 }}
                    className="image-area interactive-element flex-grow h-full flex items-center justify-center p-20" 
                    onClick={handleCarClick}
                  >
                    <img 
                        src={car.thumbnail} 
                        alt={car.title} 
                        className="w-full drop-shadow-[0_50px_50px_rgba(0,0,0,0.9)]" 
                        onError={(e) => handleImageError(e, car.brand)}
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="specs-area"
                  >
                    <span className="group overflow-hidden relative">
                        <b className="relative z-10">{car.speed} MPH</b>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"/>
                    </span>
                    <span className="group overflow-hidden relative">
                        <b className="relative z-10">{car.acceleration}s 0-100</b>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"/>
                    </span>
                    <span className="group overflow-hidden relative">
                        <b className="relative z-10">${car.price.toLocaleString()}</b>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"/>
                    </span>
                    <button 
                      className="!px-12 !py-5 !bg-white !text-black !border-none !text-xl !font-black !rounded-none hover:!bg-yellow-400 transition-colors italic uppercase tracking-tighter"
                      onClick={() => window.open(`https://www.google.com/search?q=${car.brand}+${car.title}`, '_blank')}
                    >
                      DISCOVER NOW
                    </button>
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <AnimatePresence mode="wait">
              {!showStats && activeCar && (
                <motion.div 
                    key={activeCar._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="car-info active !bottom-12 !backdrop-blur-xl !bg-black/80 !border !border-white/10 !p-8 !rounded-none"
                >
                    <h3 className="!text-3xl font-black italic uppercase mb-2" style={{ color: activeCar.colorCode }}>{activeCar.brand} {activeCar.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">{activeCar.description}</p>
                </motion.div>
              )}
          </AnimatePresence>
      </AnimatedPage>
    </div>
  );
}

const StatLine = ({ label, value }) => (
    <div className="flex justify-between items-center gap-8 border-b border-white/5 pb-1">
        <span className="text-[10px] font-bold text-gray-500 tracking-widest">{label}</span>
        <span className="text-sm font-black italic text-yellow-400">{value}</span>
    </div>
);
