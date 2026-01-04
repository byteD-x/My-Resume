import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Zap, Gauge, Code2 } from 'lucide-react';

const bentoItems = [
    {
        id: "stats-1",
        title: "Open Source",
        value: "100+",
        label: "GitHub Stars",
        icon: Star,
        colSpan: "md:col-span-1",
        bg: "bg-amber-50"
    },
    {
        id: "stats-2",
        title: "Optimizaton",
        value: "5x",
        label: "Faster API",
        icon: Zap,
        colSpan: "md:col-span-1",
        bg: "bg-blue-50"
    },
    {
        id: "stats-3",
        title: "Users Served",
        value: "1k+",
        label: "Across Apps",
        icon: Users,
        colSpan: "md:col-span-1",
        bg: "bg-rose-50"
    },
    {
        id: "main-card",
        title: "Core Competency",
        value: "AI Native",
        label: "Full Stack Development",
        icon: Code2,
        colSpan: "md:col-span-2",
        rowSpan: "md:row-span-2",
        isFocal: true
    },
    {
        id: "stats-4",
        title: "Data Migration",
        value: "300+",
        label: "Tables Processed",
        icon: Gauge,
        colSpan: "md:col-span-1",
        bg: "bg-emerald-50"
    }
];

export default function HighlightDeck() {
    return (
        <section className="py-20 bg-zinc-50 border-y border-zinc-200" id="impact">
            <div className="container-padding">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-zinc-900">Quantifiable Impact</h2>
                    <p className="text-zinc-500 mt-2">Delivering real-world value through engineering.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
                    {bentoItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`
                                relative p-6 rounded-3xl border border-zinc-200 overflow-hidden
                                hover:shadow-lg transition-all duration-300 hover:-translate-y-1
                                ${item.colSpan}
                                ${item.isFocal ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}
                            `}
                        >
                            {/* Background Texture for Focal Card */}
                            {item.isFocal && (
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <item.icon size={120} />
                                </div>
                            )}

                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div className="flex items-start justify-between">
                                    <div className={`p-2 rounded-xl ${item.isFocal ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-900'}`}>
                                        <item.icon size={24} />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className={`text-4xl font-bold tracking-tight mb-1 ${item.isFocal ? 'text-white' : 'text-zinc-900'}`}>
                                        {item.value}
                                    </div>
                                    <div className={`font-medium ${item.isFocal ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        {item.label}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
