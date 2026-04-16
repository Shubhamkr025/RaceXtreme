import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, User, LogOut, Zap, Wrench, Palette, Mail, Flag, ArrowLeftRight, Trophy, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificationBell } from './ToastSystem';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/home', icon: <Car size={20} />, label: 'Showroom' },
        { path: '/race', icon: <Flag size={20} />, label: 'Race' },
        { path: '/compare', icon: <ArrowLeftRight size={20} />, label: 'Compare' },
        { path: '/leaderboard', icon: <Trophy size={20} />, label: 'Ranks' },
        { path: '/modification', icon: <Wrench size={20} />, label: 'Mods' },
        { path: '/garage', icon: <Heart size={20} />, label: 'Garage' },
        { path: '/colors', icon: <Palette size={20} />, label: 'Colors' },
        { path: '/contact', icon: <Mail size={20} />, label: 'Contact' },
        { path: '/profile', icon: <User size={20} />, label: 'Profile' },
    ];

    return (
        <nav className="racextreme-navbar">
            <div className="navbar-brand-section">
                <Zap className="text-yellow-400" fill="currentColor" />
                <span className="tracking-tighter">RACEXTREME</span>
            </div>
            
            <div className="navbar-links">
                {navItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`nav-link-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                        {location.pathname === item.path && (
                            <motion.div 
                                layoutId="nav-underline"
                                className="nav-underline"
                            />
                        )}
                    </Link>
                ))}
                
                <NotificationBell />

                <button 
                    onClick={handleSignOut}
                    className="signout-btn"
                >
                    <LogOut size={14} />
                    SIGN OUT
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
