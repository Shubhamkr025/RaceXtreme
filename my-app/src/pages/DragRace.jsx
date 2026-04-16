import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import Speedometer from '../components/Speedometer';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, RotateCcw, Trophy, Timer, Zap } from 'lucide-react';
import { useToast } from '../components/ToastSystem';
import './DragRace.css';

const DragRace = () => {
    const { addToast } = useToast();
    const [cars, setCars] = useState([]);
    const [carA, setCarA] = useState(null);
    const [carB, setCarB] = useState(null);
    const [raceState, setRaceState] = useState('idle'); // idle, countdown, racing, finished
    const [countdown, setCountdown] = useState(3);
    const [posA, setPosA] = useState(0);
    const [posB, setPosB] = useState(0);
    const [speedA, setSpeedA] = useState(0);
    const [speedB, setSpeedB] = useState(0);
    const [rpmA, setRpmA] = useState(0);
    const [rpmB, setRpmB] = useState(0);
    const [winner, setWinner] = useState(null);
    const [raceTime, setRaceTime] = useState(0);
    const [confetti, setConfetti] = useState([]);
    const animRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/cars')
            .then(res => res.json())
            .then(data => {
                setCars(data);
                if (data.length >= 2) {
                    setCarA(data[0]);
                    setCarB(data[1]);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const runRace = () => {
        // Physics: Cars accelerate based on their real performance stats
        const maxA = carA.speed;
        const maxB = carB.speed;
        const accelA = parseFloat(carA.acceleration);
        const accelB = parseFloat(carB.acceleration);
        const powerA = carA.power;
        const powerB = carB.power;

        // Compute power factor (higher power = faster acceleration curve)
        const factorA = (powerA / 500) * (1 / accelA) * 12;
        const factorB = (powerB / 500) * (1 / accelB) * 12;

        let currentSpeedA = 0;
        let currentSpeedB = 0;
        let currentPosA = 0;
        let currentPosB = 0;
        let raceOver = false;
        const finishLine = 85; // percentage

        const frame = () => {
            if (raceOver) return;

            const elapsed = (performance.now() - startTimeRef.current) / 1000;

            // Speed: approaches max speed asymptotically with acceleration factor
            currentSpeedA = maxA * (1 - Math.exp(-factorA * elapsed / maxA));
            currentSpeedB = maxB * (1 - Math.exp(-factorB * elapsed / maxB));

            // Add slight randomness for excitement
            const jitterA = (Math.random() - 0.5) * 2;
            const jitterB = (Math.random() - 0.5) * 2;

            // Position: integral of speed curve
            currentPosA = Math.min(finishLine, factorA * elapsed * 1.8 + jitterA * 0.1);
            currentPosB = Math.min(finishLine, factorB * elapsed * 1.8 + jitterB * 0.1);

            // RPM: correlates with speed
            const rpmValA = Math.min(9000, (currentSpeedA / maxA) * 8000 + Math.random() * 500);
            const rpmValB = Math.min(9000, (currentSpeedB / maxB) * 8000 + Math.random() * 500);

            setPosA(currentPosA);
            setPosB(currentPosB);
            setSpeedA(Math.round(currentSpeedA));
            setSpeedB(Math.round(currentSpeedB));
            setRpmA(Math.round(rpmValA));
            setRpmB(Math.round(rpmValB));
            setRaceTime(elapsed);

            // Check finish
            if (currentPosA >= finishLine || currentPosB >= finishLine) {
                raceOver = true;
                const winnerCar = currentPosA >= finishLine ? carA : carB;
                setWinner(winnerCar);
                setRaceState('finished');
                spawnConfetti();
                addToast('🏁 Race Complete!', `${winnerCar.brand} ${winnerCar.title} wins in ${elapsed.toFixed(2)}s!`, 'race', 6000);
                return;
            }

            animRef.current = requestAnimationFrame(frame);
        };

        animRef.current = requestAnimationFrame(frame);
    };

    const startRace = () => {
        if (!carA || !carB || raceState !== 'idle') return;
        
        setRaceState('countdown');
        setPosA(0);
        setPosB(0);
        setSpeedA(0);
        setSpeedB(0);
        setRpmA(0);
        setRpmB(0);
        setWinner(null);
        setRaceTime(0);
        setConfetti([]);

        let count = 3;
        setCountdown(3);
        
        const countdownTimer = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) {
                clearInterval(countdownTimer);
                setRaceState('racing');
                startTimeRef.current = performance.now();
                runRace();
            }
        }, 1000);
    };

    const spawnConfetti = () => {
        const colors = ['#EFCA29', '#3b82f6', '#22c55e', '#ef4444', '#a855f7', '#f97316', '#ec4899'];
        const pieces = Array.from({ length: 60 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: `${Math.random() * 1.5}s`,
            size: `${Math.random() * 8 + 6}px`,
            rotation: `${Math.random() * 360}deg`
        }));
        setConfetti(pieces);
        setTimeout(() => setConfetti([]), 4000);
    };

    const resetRace = () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        setRaceState('idle');
        setPosA(0);
        setPosB(0);
        setSpeedA(0);
        setSpeedB(0);
        setRpmA(0);
        setRpmB(0);
        setWinner(null);
        setRaceTime(0);
        setConfetti([]);
    };

    // RPM bar segments
    const RPMBar = ({ rpm, color }) => {
        const segments = 20;
        return (
            <div className="rpm-bar-container">
                {Array.from({ length: segments }, (_, i) => {
                    const threshold = (i / segments) * 9000;
                    const isActive = rpm > threshold;
                    const isRedZone = i >= 16;
                    return (
                        <div
                            key={i}
                            className="rpm-bar-segment"
                            style={{
                                height: `${10 + i * 1.5}px`,
                                background: isActive
                                    ? isRedZone ? '#ef4444' : color
                                    : 'rgba(255,255,255,0.05)'
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="drag-race-page">
            <Navbar />
            <AnimatedPage>
                <div className="max-w-container" style={{ padding: '0 2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <h1 className="text-huge">DRAG<br /><span className="text-accent">RACE.</span></h1>
                        <p className="text-dim">Select two vehicles and watch them battle for supremacy.</p>
                    </motion.div>

                    {/* Car Selection */}
                    <div className="race-selector">
                        <div className="race-slot player-a">
                            <div className="race-slot-label a">🟡 PLAYER A</div>
                            <div className="car-selector-grid">
                                {cars.map(car => (
                                    <motion.div
                                        key={`a-${car._id}`}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`car-option ${carA?._id === car._id ? 'selected-a' : ''}`}
                                        onClick={() => raceState === 'idle' && setCarA(car)}
                                    >
                                        <img src={car.thumbnail} alt={car.brand} />
                                        <div className="car-option-name">{car.brand}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '2rem', fontWeight: 900, color: 'rgba(255,255,255,0.1)' }}>
                            VS
                        </div>

                        <div className="race-slot player-b">
                            <div className="race-slot-label b">🔵 PLAYER B</div>
                            <div className="car-selector-grid">
                                {cars.map(car => (
                                    <motion.div
                                        key={`b-${car._id}`}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`car-option ${carB?._id === car._id ? 'selected-b' : ''}`}
                                        onClick={() => raceState === 'idle' && setCarB(car)}
                                    >
                                        <img src={car.thumbnail} alt={car.brand} />
                                        <div className="car-option-name">{car.brand}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Race Track */}
                    <div className="race-track-container">
                        <div className="race-track-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Flag size={16} className="text-accent" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>QUARTER MILE STRIP</span>
                            </div>
                            <div className={`race-status ${raceState}`}>
                                {raceState === 'idle' && 'STANDING BY'}
                                {raceState === 'countdown' && 'LAUNCHING...'}
                                {raceState === 'racing' && 'RACE IN PROGRESS'}
                                {raceState === 'finished' && '🏁 RACE COMPLETE'}
                            </div>
                            {raceState !== 'idle' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EFCA29' }}>
                                    <Timer size={14} />
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace' }}>
                                        {raceTime.toFixed(2)}s
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Lane A */}
                        <div className="race-lane">
                            <div className="lane-track" />
                            <div className="lane-markers">
                                {Array.from({ length: 10 }, (_, i) => <div key={i} className="lane-marker" />)}
                            </div>
                            <div className="lane-finish" />
                            <span className="lane-label a">{carA?.brand || 'A'}</span>
                            {carA && (
                                <img
                                    src={carA.thumbnail}
                                    alt={carA.brand}
                                    className="race-car-sprite"
                                    style={{ left: `${Math.max(5, posA)}%` }}
                                />
                            )}
                        </div>

                        {/* Lane B */}
                        <div className="race-lane">
                            <div className="lane-track" />
                            <div className="lane-markers">
                                {Array.from({ length: 10 }, (_, i) => <div key={i} className="lane-marker" />)}
                            </div>
                            <div className="lane-finish" />
                            <span className="lane-label b">{carB?.brand || 'B'}</span>
                            {carB && (
                                <img
                                    src={carB.thumbnail}
                                    alt={carB.brand}
                                    className="race-car-sprite"
                                    style={{ left: `${Math.max(5, posB)}%` }}
                                />
                            )}
                        </div>

                        {/* Countdown overlay */}
                        <AnimatePresence>
                            {raceState === 'countdown' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="countdown-overlay"
                                >
                                    <motion.div
                                        key={countdown}
                                        initial={{ scale: 2, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ type: 'spring', damping: 12 }}
                                    >
                                        {countdown > 0 ? (
                                            <div className="countdown-number">{countdown}</div>
                                        ) : (
                                            <div className="countdown-go">GO!</div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Gauges */}
                    <div className="gauges-row">
                        <div className="gauge-section">
                            <div className="gauge-label" style={{ color: '#EFCA29' }}>{carA?.brand || 'Player A'}</div>
                            <Speedometer value={speedA} max={carA?.speed || 300} label="MPH" size={160} color="#EFCA29" />
                            <RPMBar rpm={rpmA} color="#EFCA29" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <Zap size={32} className="text-accent" style={{ opacity: 0.2 }} />
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}>
                                TELEMETRY
                            </div>
                        </div>

                        <div className="gauge-section">
                            <div className="gauge-label" style={{ color: '#3b82f6' }}>{carB?.brand || 'Player B'}</div>
                            <Speedometer value={speedB} max={carB?.speed || 300} label="MPH" size={160} color="#3b82f6" />
                            <RPMBar rpm={rpmB} color="#3b82f6" />
                        </div>
                    </div>

                    {/* Winner Banner */}
                    <AnimatePresence>
                        {winner && (
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="winner-banner"
                            >
                                <div className="winner-crown">👑</div>
                                <div className="winner-name" style={{ color: winner.colorCode }}>
                                    {winner.brand} {winner.title}
                                </div>
                                <div className="winner-time">
                                    <Trophy size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Crossed the finish line in {raceTime.toFixed(2)} seconds
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Control Buttons */}
                    <div style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
                        {raceState === 'idle' && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`start-race-btn ${carA && carB ? 'ready' : 'disabled'}`}
                                onClick={startRace}
                                disabled={!carA || !carB}
                            >
                                <Flag size={20} />
                                {carA && carB ? 'START DRAG RACE' : 'SELECT BOTH CARS TO RACE'}
                            </motion.button>
                        )}
                        {(raceState === 'finished') && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="start-race-btn reset"
                                onClick={resetRace}
                            >
                                <RotateCcw size={20} />
                                RACE AGAIN
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Confetti */}
                {confetti.length > 0 && (
                    <div className="confetti-container">
                        {confetti.map(piece => (
                            <div
                                key={piece.id}
                                className="confetti-piece"
                                style={{
                                    left: piece.left,
                                    background: piece.color,
                                    animationDelay: piece.delay,
                                    width: piece.size,
                                    height: piece.size,
                                    borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                                }}
                            />
                        ))}
                    </div>
                )}
            </AnimatedPage>
        </div>
    );
};

export default DragRace;
