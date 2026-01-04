import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Globe, Phone, Copy, Check, ArrowRight } from 'lucide-react';
import { ContactData, HeroData } from '@/types';

interface ContactProps {
    contactData: ContactData;
    heroData: HeroData;
}

export default function Contact({ contactData, heroData }: ContactProps) {
    const [copied, setCopied] = useState(false);
    const email = contactData.email;

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-24 relative" id="contact">
            <div className="container-padding max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
                >
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -z-10" />

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Ready to Build <span className="text-gradient-main">Something Amazing?</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Whether you have a question, a project idea, or just want to say hi, I&apos;m always open to new opportunities and collaborations.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                        <button
                            onClick={handleCopy}
                            className="group relative flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl transition-all w-full md:w-auto justify-center"
                        >
                            <Mail className="text-cyan-400" />
                            <span className="text-lg font-medium text-gray-200">{email}</span>
                            <div className="ml-2 p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-gray-400 group-hover:text-white" />}
                            </div>

                            {copied && (
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-black text-xs font-bold rounded-lg animate-fade-in-up">
                                    Copied!
                                </span>
                            )}
                        </button>

                        <a
                            href={contactData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all w-full md:w-auto justify-center shadow-lg shadow-white/10"
                        >
                            <Github />
                            <span>GitHub Profile</span>
                            <ArrowRight size={18} />
                        </a>
                    </div>

                    {/* Social Links Matrix */}
                    <div className="flex flex-wrap justify-center gap-6 pt-10 border-t border-white/5">
                        <a href={`tel:${contactData.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <Phone size={18} />
                            <span>{contactData.phone}</span>
                        </a>
                        <a href={contactData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <Globe size={18} />
                            <span>{contactData.website}</span>
                        </a>
                    </div>
                </motion.div>

                <div className="text-center mt-12 text-gray-500 text-sm">
                    © {new Date().getFullYear()} {heroData.name}. All rights reserved. Built with Next.js, Tailwind & Motion.
                </div>
            </div>
        </section>
    );
}
