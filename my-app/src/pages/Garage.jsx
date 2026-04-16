import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Car, ArrowRight, Share2, Copy, X, DollarSign } from 'lucide-react';
import { useToast } from '../components/ToastSystem';
import './Garage.css';

const Garage = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [garageCars, setGarageCars] = useState([]);
    const [showShareCard, setShowShareCard] = useState(false);

    useEffect(() => {
        loadGarage();
    }, []);

    const loadGarage = () => {
        try {
            const saved = JSON.parse(localStorage.getItem('racextreme_garage') || '[]');
            setGarageCars(saved);
        } catch {
            setGarageCars([]);
        }
    };

    const removeFromGarage = (carId) => {
        const updated = garageCars.filter(c => c._id !== carId);
        localStorage.setItem('racextreme_garage', JSON.stringify(updated));
        setGarageCars(updated);
        addToast('Removed from Garage', 'Vehicle has been removed from your collection.', 'info');
    };

    const totalValue = garageCars.reduce((sum, car) => sum + (car.price || 0), 0);
    const avgPerformance = garageCars.length > 0
        ? Math.round(garageCars.reduce((sum, car) => sum + (car.performance || 0), 0) / garageCars.length)
        : 0;
    const topSpeed = garageCars.length > 0
        ? Math.max(...garageCars.map(car => car.speed || 0))
        : 0;

    const handleCopyShare = () => {
        const shareText = `🏎️ My RaceXtreme Dream Garage:\n${garageCars.map(c => `• ${c.brand} ${c.title}`).join('\n')}\n\n💰 Total Value: $${totalValue.toLocaleString()}\n⚡ Top Speed: ${topSpeed} MPH`;
        navigator.clipboard.writeText(shareText);
        addToast('Copied!', 'Dream Build summary copied to clipboard.', 'success');
        setShowShareCard(false);
    };

    if (garageCars.length === 0) {
        return (
            <div className="elite-page garage-page">
                <Navbar />
                <AnimatedPage>
                    <div className="max-w-container">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ marginBottom: '2rem' }}
                        >
                            <h1 className="text-huge">MY<br /><span className="text-accent">GARAGE.</span></h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="garage-empty"
                        >
                            <div className="garage-empty-icon">
                                <Car size={48} style={{ color: 'rgba(255,255,255,0.15)' }} />
                            </div>
                            <h2>Your garage is empty</h2>
                            <p>Head to the showroom and add your dream cars to your personal collection.</p>
                            <button className="garage-empty-btn" onClick={() => navigate('/home')}>
                                <Car size={18} /> VISIT SHOWROOM <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    </div>
                </AnimatedPage>
            </div>
        );
    }

    return (
        <div className="elite-page garage-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
                    >
                        <div>
                            <h1 className="text-huge">MY<br /><span className="text-accent">GARAGE.</span></h1>
                            <p className="text-dim">{garageCars.length} vehicle{garageCars.length !== 1 ? 's' : ''} in your personal collection.</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowShareCard(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.75rem 1.5rem', borderRadius: '1rem',
                                background: 'rgba(239, 202, 41, 0.1)', border: '1px solid rgba(239, 202, 41, 0.2)',
                                color: '#EFCA29', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                            }}
                        >
                            <Share2 size={16} /> DREAM BUILD
                        </motion.button>
                    </motion.div>

                    {/* Collection Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="collection-value-card"
                    >
                        <div>
                            <div className="collection-stat-value" style={{ color: '#EFCA29' }}>
                                <DollarSign size={24} style={{ display: 'inline' }} />{totalValue.toLocaleString()}
                            </div>
                            <div className="collection-stat-label">TOTAL COLLECTION VALUE</div>
                        </div>
                        <div>
                            <div className="collection-stat-value" style={{ color: '#3b82f6' }}>
                                {topSpeed}<span style={{ fontSize: '1rem' }}> MPH</span>
                            </div>
                            <div className="collection-stat-label">TOP SPEED IN GARAGE</div>
                        </div>
                        <div>
                            <div className="collection-stat-value" style={{ color: '#22c55e' }}>
                                {avgPerformance}<span style={{ fontSize: '1rem' }}>%</span>
                            </div>
                            <div className="collection-stat-label">AVG PERFORMANCE</div>
                        </div>
                    </motion.div>

                    {/* Car Cards */}
                    <div className="garage-grid">
                        <AnimatePresence>
                            {garageCars.map((car, i) => (
                                <motion.div
                                    key={car._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="garage-card"
                                    layout
                                >
                                    <div className="garage-card-image" style={{ background: `linear-gradient(135deg, ${car.colorCode}10, transparent)` }}>
                                        <img src={car.thumbnail} alt={car.brand} />
                                    </div>
                                    <div className="garage-card-body">
                                        <div className="garage-card-brand" style={{ color: car.colorCode }}>{car.brand}</div>
                                        <div className="garage-card-title">{car.title}</div>

                                        <div className="garage-card-stats">
                                            <div className="garage-stat">
                                                <div className="garage-stat-value">{car.speed}</div>
                                                <div className="garage-stat-label">MPH</div>
                                            </div>
                                            <div className="garage-stat">
                                                <div className="garage-stat-value">{car.power}</div>
                                                <div className="garage-stat-label">HP</div>
                                            </div>
                                            <div className="garage-stat">
                                                <div className="garage-stat-value">{car.acceleration}s</div>
                                                <div className="garage-stat-label">0-100</div>
                                            </div>
                                            <div className="garage-stat">
                                                <div className="garage-stat-value">{car.performance}%</div>
                                                <div className="garage-stat-label">PERF</div>
                                            </div>
                                        </div>

                                        <div className="garage-card-footer">
                                            <div className="garage-card-price">${car.price.toLocaleString()}</div>
                                            <button className="garage-remove-btn" onClick={() => removeFromGarage(car._id)}>
                                                <Trash2 size={13} /> REMOVE
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Share Card Overlay */}
                <AnimatePresence>
                    {showShareCard && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="share-card-overlay"
                            onClick={() => setShowShareCard(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="share-card"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="share-card-title">⚡ RACEXTREME DREAM BUILD</div>
                                <div className="share-card-cars">
                                    {garageCars.map(car => (
                                        <span key={car._id} className="share-car-chip" style={{ borderColor: car.colorCode }}>
                                            {car.brand} {car.title}
                                        </span>
                                    ))}
                                </div>
                                <div className="share-card-total">${totalValue.toLocaleString()}</div>
                                <div className="share-card-label">Total Collection Value</div>
                                <div className="share-card-actions">
                                    <button
                                        onClick={handleCopyShare}
                                        style={{ background: '#EFCA29', color: 'black', border: 'none' }}
                                    >
                                        <Copy size={16} /> Copy to Clipboard
                                    </button>
                                    <button
                                        onClick={() => setShowShareCard(false)}
                                        style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                    >
                                        <X size={16} /> Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </AnimatedPage>
        </div>
    );
};

export default Garage;
