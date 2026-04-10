import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { Zap, Gauge, Wind } from 'lucide-react';

const Modification = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modLevels, setModLevels] = useState({
        engine: 0,
        aero: 0,
        suspension: 0,
        nitro: 0,
        weight: 0,
        grip: 0
    });

    useEffect(() => {
        fetch('http://localhost:5000/api/cars')
            .then(res => {
                if (!res.ok) throw new Error('Database connection failed');
                return res.json();
            })
            .then(data => {
                setCars(data);
                if (data.length > 0) setSelectedCar(data[0]);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching cars:", err);
                setLoading(false);
            });
    }, []);

    const calculateNewStat = (base, level, multiplier) => {
        return Math.floor(base * (1 + (level * multiplier)));
    };

    const getBuildCost = () => {
        const totalStages = Object.values(modLevels).reduce((a, b) => a + b, 0);
        return totalStages * 15000;
    };

    if (loading) return <div className="elite-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    return (
        <div className="elite-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    <div className="grid-auto grid-cols-3" style={{ gap: '2rem', alignItems: 'start' }}>
                        
                        {/* Car Selector Column */}
                        <div className="elite-card">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>SELECT VEHICLE</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {cars.map((car) => (
                                    <button 
                                        key={car._id}
                                        onClick={() => {
                                            setSelectedCar(car);
                                            setModLevels({ engine: 0, aero: 0, suspension: 0, nitro: 0, weight: 0, grip: 0 });
                                        }}
                                        style={{ 
                                            display: 'flex', 
                                            padding: '1rem', 
                                            borderRadius: '1rem', 
                                            background: selectedCar?._id === car._id ? 'rgba(239, 202, 41, 0.1)' : 'rgba(255,255,255,0.02)',
                                            border: `1px solid ${selectedCar?._id === car._id ? '#EFCA29' : 'rgba(255,255,255,0.05)'}`,
                                            textAlign: 'left',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <img src={car.thumbnail} alt="" style={{ width: '50px', height: '30px', objectFit: 'contain', marginRight: '1rem' }} />
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{car.brand}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{car.title}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mod Controls Column */}
                        <div className="elite-card" style={{ gridColumn: 'span 2' }}>
                            {selectedCar && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: selectedCar.colorCode }}>{selectedCar.brand.toUpperCase()} TUNING</h1>
                                            <p className="text-dim">Professional-grade performance laboratory for the {selectedCar.title}.</p>
                                        </div>
                                        <img src={selectedCar.thumbnail} alt="" style={{ width: '300px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
                                    </div>

                                    <div className="grid-auto grid-cols-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                                        <div className="space-y-6">
                                            <ModSlider 
                                                icon={<Zap size={20}/>} 
                                                label="Engine Mapping" 
                                                level={modLevels.engine} 
                                                setLevel={(l) => setModLevels({...modLevels, engine: l})} 
                                                color={selectedCar.colorCode}
                                            />
                                            <ModSlider 
                                                icon={<Wind size={20}/>} 
                                                label="Aero Package" 
                                                level={modLevels.aero} 
                                                setLevel={(l) => setModLevels({...modLevels, aero: l})} 
                                                color={selectedCar.colorCode}
                                            />
                                            <ModSlider 
                                                icon={<Gauge size={20}/>} 
                                                label="Suspension Geometry" 
                                                level={modLevels.suspension} 
                                                setLevel={(l) => setModLevels({...modLevels, suspension: l})} 
                                                color={selectedCar.colorCode}
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <ModSlider 
                                                icon={<Zap size={20} className="text-blue-400" />} 
                                                label="Nitro Mapping" 
                                                level={modLevels.nitro} 
                                                setLevel={(l) => setModLevels({...modLevels, nitro: l})} 
                                                color="#60a5fa"
                                            />
                                            <ModSlider 
                                                icon={<Wind size={20} className="text-gray-400" />} 
                                                label="Carbon Bodywork" 
                                                level={modLevels.weight} 
                                                setLevel={(l) => setModLevels({...modLevels, weight: l})} 
                                                color="#94a3b8"
                                            />
                                            <ModSlider 
                                                icon={<Gauge size={20} className="text-green-400" />} 
                                                label="Racing Slicks" 
                                                level={modLevels.grip} 
                                                setLevel={(l) => setModLevels({...modLevels, grip: l})} 
                                                color="#4ade80"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#EFCA29', letterSpacing: '0.1em' }}>ESTIMATED PERFORMANCE</h3>
                                            <div className="text-right">
                                                <div className="text-[10px] text-dim font-bold">TOTAL BUILD COST</div>
                                                <div className="text-xl font-black text-white">${getBuildCost().toLocaleString()}</div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '3rem' }}>
                                            <StatDisplay 
                                                label="TOP SPEED" 
                                                oldValue={selectedCar.speed} 
                                                newValue={calculateNewStat(selectedCar.speed, modLevels.engine + (modLevels.nitro * 0.5), 0.05)} 
                                                unit="MPH"
                                            />
                                            <StatDisplay 
                                                label="ACCEL" 
                                                oldValue={selectedCar.acceleration} 
                                                newValue={(selectedCar.acceleration * (1 - (modLevels.engine * 0.08) - (modLevels.weight * 0.04))).toFixed(2)} 
                                                unit="s"
                                                inverse
                                            />
                                            <StatDisplay 
                                                label="PERFORMANCE" 
                                                oldValue={selectedCar.performance} 
                                                newValue={Math.min(100, calculateNewStat(selectedCar.performance, modLevels.engine + modLevels.aero + modLevels.suspension + modLevels.nitro + modLevels.grip, 0.02))} 
                                                unit="%"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        className="glass-morphism btn-elite" 
                                        style={{ 
                                            width: '100%', padding: '1.25rem', borderRadius: '1rem', fontWeight: 'bold', 
                                            background: selectedCar.colorCode, color: 'black', border: 'none',
                                            fontSize: '1rem', cursor: 'pointer'
                                        }}
                                    >
                                        APPLY ELITE MODIFICATIONS
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </AnimatedPage>
        </div>
    );
};

const ModSlider = ({ icon, label, level, setLevel, color }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}>
            {icon}
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[0, 1, 2, 3].map((l) => (
                <button 
                    key={l}
                    onClick={() => setLevel(l)}
                    style={{ 
                        flex: 1, height: '8px', borderRadius: '4px',
                        background: level >= l ? color : 'rgba(255,255,255,0.1)',
                        border: 'none', transition: 'all 0.3s',
                        cursor: 'pointer'
                    }}
                />
            ))}
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: color }}>STAGE {level}</div>
    </div>
);

const StatDisplay = ({ label, oldValue, newValue, unit, inverse }) => {
    const isImproved = inverse ? (parseFloat(newValue) < parseFloat(oldValue)) : (parseFloat(newValue) > parseFloat(oldValue));
    
    return (
        <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{newValue}{unit}</span>
                {isImproved && (
                    <motion.span 
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                        style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 'bold' }}
                    >
                        {inverse ? '↓' : '↑'} {inverse ? (oldValue - newValue).toFixed(2) : (newValue - oldValue)}{unit}
                    </motion.span>
                )}
            </div>
        </div>
    );
};

export default Modification;
