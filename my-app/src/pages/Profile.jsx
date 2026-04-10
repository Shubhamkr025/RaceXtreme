import React from 'react';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import { User, Mail, Building, Phone, Calendar, MapPin } from 'lucide-react';

const Profile = () => {
    const userData = {
        firstName: 'Shubham',
        lastName: 'Kumar Singh',
        email: 'admin@racextreme.com',
        username: 'admin',
        phone: '+91 999 000 1111',
        company: 'RaceXtreme Elite',
        address: 'Sector 5, Noida, UP',
        dob: '1998-05-15'
    };

    return (
        <div className="elite-page">
            <Navbar />
            <AnimatedPage>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="elite-card"
                        style={{ padding: 0, overflow: 'hidden' }}
                    >
                        <div style={{ height: '12rem', background: 'linear-gradient(to right, #EFCA29, #b89b1d)', position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: '-4rem', left: '3rem', width: '8rem', height: '8rem', background: 'white', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ width: '100%', height: '100%', background: '#e5e7eb', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                     <User size={60} className="text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div style={{ paddingTop: '5rem', paddingLeft: '3rem', paddingRight: '3rem', paddingBottom: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{userData.firstName} {userData.lastName}</h1>
                                    <p className="text-accent" style={{ fontWeight: '500', fontSize: '0.875rem' }}>@ {userData.username}</p>
                                </div>
                                <button className="glass-morphism" style={{ padding: '0.5rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', color: 'white' }}>
                                    EDIT PROFILE
                                </button>
                            </div>

                            <div className="grid-auto grid-cols-2">
                                <InfoItem icon={<Mail size={18}/>} label="Email" value={userData.email} />
                                <InfoItem icon={<Building size={18}/>} label="Company" value={userData.company} />
                                <InfoItem icon={<Phone size={18}/>} label="Phone" value={userData.phone} />
                                <InfoItem icon={<Calendar size={18}/>} label="Birth Date" value={userData.dob} />
                                <InfoItem icon={<MapPin size={18}/>} label="Address" value={userData.address} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AnimatedPage>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-dim">{icon}</span>
        </div>
        <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{label}</p>
            <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{value}</p>
        </div>
    </div>
);

export default Profile;
