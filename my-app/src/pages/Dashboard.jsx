import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, Users, Package, ArrowRight, Flag, ArrowLeftRight, Trophy, Heart, Clock, Zap, Car, Gauge } from 'lucide-react';

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

    // Time-of-day greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const userName = (() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.firstName || user.username || 'Elite Member';
        } catch { return 'Elite Member'; }
    })();

    // Garage count
    const garageCount = (() => {
        try {
            return JSON.parse(localStorage.getItem('racextreme_garage') || '[]').length;
        } catch { return 0; }
    })();

    const quickActions = [
        { label: 'DRAG RACE', desc: 'Head-to-head speed battles', icon: <Flag size={24} />, path: '/race', color: '#22c55e', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.03))' },
        { label: 'COMPARE', desc: 'Side-by-side stat showdown', icon: <ArrowLeftRight size={24} />, path: '/compare', color: '#3b82f6', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.03))' },
        { label: 'LEADERBOARD', desc: 'Who reigns supreme?', icon: <Trophy size={24} />, path: '/leaderboard', color: '#EFCA29', gradient: 'linear-gradient(135deg, rgba(239,202,41,0.15), rgba(239,202,41,0.03))' },
        { label: 'MY GARAGE', desc: `${garageCount} car${garageCount !== 1 ? 's' : ''} saved`, icon: <Heart size={24} />, path: '/garage', color: '#ef4444', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.03))' },
    ];

    const recentActivity = [
        { icon: <Zap size={14} />, text: 'System initialized — Elite Mode active', time: 'Just now', color: '#EFCA29' },
        { icon: <Car size={14} />, text: 'Showroom database synchronized', time: '2m ago', color: '#3b82f6' },
        { icon: <Gauge size={14} />, text: 'Performance telemetry calibrated', time: '5m ago', color: '#22c55e' },
        { icon: <Trophy size={14} />, text: 'Leaderboard rankings updated', time: '12m ago', color: '#a855f7' },
        { icon: <TrendingUp size={14} />, text: 'Market analytics refreshed', time: '30m ago', color: '#f97316' },
    ];

    return (
        <div className="elite-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container">
                    {/* Welcome Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#EFCA29', marginBottom: '0.5rem' }}>
                            {getGreeting().toUpperCase()}, {userName.toUpperCase()}
                        </div>
                        <h1 className="text-huge">WELCOME TO THE ELITE.</h1>
                        <p className="text-dim">Your command center for the world's most exclusive hypercars.</p>
                    </motion.div>

                    {/* Stats Row */}
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

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <h2 style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem' }}>
                            QUICK ACTIONS
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {quickActions.map((action, i) => (
                                <motion.div
                                    key={action.path}
                                    whileHover={{ scale: 1.02, y: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(action.path)}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.08 }}
                                    style={{
                                        background: action.gradient,
                                        border: `1px solid ${action.color}22`,
                                        borderRadius: '1.25rem',
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.25rem'
                                    }}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: '1rem',
                                        background: `${action.color}20`, color: action.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {action.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.01em', marginBottom: '0.15rem' }}>{action.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{action.desc}</div>
                                    </div>
                                    <ArrowRight size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid-auto grid-cols-3">
                        {/* Trending Showroom */}
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

                        {/* CTA Card */}
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

                    {/* Activity Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="elite-card"
                        style={{ marginTop: '1.5rem', marginBottom: '3rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>
                                <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem', color: '#EFCA29' }} />
                                Recent Activity
                            </h3>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>LIVE FEED</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {recentActivity.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + i * 0.08 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '0.85rem 0',
                                        borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '0.5rem',
                                        background: `${item.color}15`, color: item.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>{item.text}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </AnimatedPage>
        </div>
    );
};



export default Dashboard;
