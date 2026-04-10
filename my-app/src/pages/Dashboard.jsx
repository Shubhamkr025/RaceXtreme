import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, Users, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const [stats] = useState([
        { label: 'Cars in Stock', value: '12', icon: <Package size={20}/>, color: '#3b82f6' },
        { label: 'Active Buyers', value: '1.2k', icon: <Users size={20}/>, color: '#22c55e' },
        { label: 'Market Growth', value: '+24%', icon: <TrendingUp size={20}/>, color: '#EFCA29' },
        { label: 'Total Sales', value: '$4.2M', icon: <ShoppingCart size={20}/>, color: '#a855f7' },
    ]);

    return (
        <div className="elite-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-huge">WELCOME TO THE ELITE.</h1>
                        <p className="text-dim">Manage your car collection and browse the latest hypercars.</p>
                    </motion.div>

                    <div className="grid-auto grid-cols-4 mb-12">
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="elite-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ background: stat.color + '33', padding: '0.75rem', borderRadius: '0.75rem', color: stat.color }}>
                                        {stat.icon}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)' }}>LIVE DATA</span>
                                </div>
                                <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>{stat.value}</h3>
                                <p className="text-dim">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid-auto grid-cols-3">
                        <motion.div className="elite-card" style={{ gridColumn: 'span 2', position: 'relative' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Trending Showroom</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    '/img-1.png',
                                    '/img-2.png',
                                    '/img-3.png'
                                ].map((url, i) => (
                                    <div key={i} style={{ display: 'flex', padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                                        <div style={{ width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden', marginRight: '1rem' }}>
                                            <img 
                                                src={url} 
                                                alt="car" 
                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
                                            />
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>Hypercar Series {i+1}</h4>
                                            <p className="text-dim" style={{ fontSize: '0.75rem' }}>Limited Edition / V12 Hybrid</p>
                                        </div>
                                        <div style={{ alignSelf: 'center' }}><ArrowRight size={16} /></div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            className="elite-card" 
                            style={{ 
                                background: 'linear-gradient(135deg, #EFCA29, #b89b1d)', 
                                color: 'black',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1, marginBottom: '1rem' }}>NEXT<br/>LEVEL.</h2>
                                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Experience the 420 MPH limited Chiron available now.</p>
                            </div>
                            <Link to="/home" style={{ 
                                background: 'black', color: 'white', padding: '1rem', borderRadius: '1rem', 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginTop: '2rem'
                            }}>
                                <b>SHOWROOM</b>
                                <ArrowRight />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </AnimatedPage>
        </div>
    );
};



export default Dashboard;
