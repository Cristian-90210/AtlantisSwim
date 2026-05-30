import React from 'react';
import { faqItems } from '../data/faqItems';

export const FAQSection: React.FC = () => {
    return (
        <section id="faq" className="relative overflow-hidden scroll-mt-28 pt-20 pb-6 md:pb-8">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#04152f_0%,#04152f_46%,rgba(4,21,47,0.88)_68%,rgba(4,21,47,0.52)_84%,rgba(4,21,47,0.18)_94%,rgba(4,21,47,0)_100%)]" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="scroll-reveal reveal-up text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wide">
                        <span className="text-host-cyan">Intrebari frecvente</span>
                    </h2>
                    <p className="text-blue-100/70 max-w-2xl mx-auto leading-relaxed">
                        Gaseste rapid raspunsuri la cele mai comune intrebari despre antrenamentele Atlantis SwimSchool.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                    {faqItems.map((item, idx) => (
                        <article
                            key={item.question}
                            className={`scroll-reveal reveal-up stagger-${Math.min(idx + 1, 6)} rounded-2xl border border-cyan-300/10 bg-[#0a2242]/80 p-6 md:p-7 shadow-xl shadow-slate-950/20`}
                        >
                            <div className="w-12 h-1 rounded-full bg-host-cyan mb-5" />
                            <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                                {item.question}
                            </h3>
                            <p className="text-sm leading-7 text-blue-100/75">
                                {item.answer}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
