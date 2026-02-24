import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Globe, ShieldCheck, HeartPulse, TreePine, Droplets, MapPin, Wind, Sprout, ArrowRight, Target } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';

const Home = () => {
    const { t } = useTranslation();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="flex flex-col min-h-screen bg-cream-50 dark:bg-dark-900 text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Hero Parallax Section */}
            <section ref={targetRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Visuals */}
                <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                    {/* Abstract Forest Shapes */}
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-300/20 dark:bg-primary-900/40 blur-[100px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-200/30 dark:bg-teal-900/40 blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 soft-shadow border border-primary-500/20 dark:border-primary-400/10 text-primary-700 dark:text-primary-300 text-sm font-semibold uppercase tracking-widest"
                    >
                        <Sprout size={16} /> Empowering Biodiversity
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight font-sans text-slate-900 dark:text-white"
                    >
                        Invest deeply in <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-teal-500">Nature's Future</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-2xl max-w-2xl mx-auto text-slate-600 dark:text-slate-400 mb-10 font-medium leading-relaxed"
                    >
                        BioFund Connect links you with verified conservation projects fighting climate change, saving wildlife, and restoring vital ecosystems.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link to="/register" className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-emerald-600 hover:from-primary-600 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-xl shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-2 relative overflow-hidden group">
                            <span className="relative z-10">{t('GetStarted')}</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        </Link>
                        <Link to="/explore" className="w-full sm:w-auto glass border border-slate-300 dark:border-dark-800 hover:bg-white/90 dark:hover:bg-dark-800 text-slate-800 dark:text-slate-200 font-bold py-4 px-10 rounded-xl shadow-sm transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                            {t('Explore')} <MapPin size={20} />
                        </Link>
                    </motion.div>
                </div>

                {/* Floating Decorative Elements */}
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute bottom-[20%] left-[10%] hidden md:block text-primary-400/40 dark:text-primary-600/30">
                    <Leaf size={64} style={{ transform: 'rotate(-45deg)' }} />
                </motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute top-[30%] right-[15%] hidden lg:block text-teal-400/40 dark:text-teal-700/30">
                    <Wind size={80} />
                </motion.div>
            </section>

            {/* Global Impact Counters */}
            <section className="py-16 relative z-10 -mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-white/5 relative overflow-hidden">
                        {/* Decorative blob inside */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-teal-400/20 rounded-full blur-2xl"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-hidden md:divide-x divide-slate-200 dark:divide-dark-800 text-center relative z-10">
                            <div className="flex flex-col items-center">
                                <TreePine className="h-10 w-10 text-emerald-500 mb-3" />
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 font-sans">
                                    <CountUp end={1250000} formattingFn={(v) => (v / 1000000).toFixed(1) + 'M+'} duration={3} />
                                </h3>
                                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trees Planted</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Droplets className="h-10 w-10 text-blue-500 mb-3" />
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 font-sans">
                                    <CountUp end={8500000} formattingFn={(v) => (v / 1000000).toFixed(1) + 'M+'} duration={3.5} />
                                </h3>
                                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Gallons Water Saved</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <HeartPulse className="h-10 w-10 text-rose-500 mb-3" />
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 font-sans">
                                    $<CountUp end={2400000} formattingFn={(v) => (v / 1000000).toFixed(1) + 'M+'} duration={2.5} />
                                </h3>
                                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Funds Raised</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-primary-600 dark:text-primary-400 uppercase mb-3">Core Pillars</h2>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Why Join BioFund Connect?</h3>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-3 gap-8 lg:gap-12"
                    >
                        {/* Feature 1 */}
                        <motion.div variants={itemVariants} className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-dark-800 soft-shadow border border-slate-100 dark:border-dark-800 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                <Globe size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Global Impact Maps</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">Visualize project locations with interactive mapping. See exactly where your funds are making a geographical difference across continents.</p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div variants={itemVariants} className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-dark-800 soft-shadow border border-slate-100 dark:border-dark-800 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-lime-100 dark:from-primary-900/40 dark:to-lime-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Verified Milestones</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">Funds are safely escrowed and released chronologically as NGOs complete verified, evidence-based milestones ensuring transparency.</p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div variants={itemVariants} className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-dark-800 soft-shadow border border-slate-100 dark:border-dark-800 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                <Target size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Gamified Impact</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">Earn achievement badges, hit conservation streaks, and compete on the global leaderboard to become a legendary conservationist.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Community Call to Action */}
            <section className="py-24 bg-dark-900 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-dark-900 z-0"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/tree-bark.png')] mix-blend-overlay"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black mb-6 leading-tight">Ready to leave a legacy <br />for the planet?</h2>
                    <p className="text-lg text-slate-300 mb-10">Whether you're an NGO scaling an ecosystem project or a donor wanting transparent impact, you belong here.</p>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-dark-900 font-bold py-4 px-10 rounded-xl shadow-xl transition-all hover:scale-105">
                        Start Making Impact <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
