import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { faqItems } from '../data/faqItems';

export const FAQPage: React.FC = () => {
    return (
        <div className="min-h-screen pb-20">
            <PageHeader
                title={<>ÎNTREBĂRI <span className="text-host-cyan">FRECVENTE</span></>}
                subtitle="Găsește răspunsuri la cele mai comune întrebări despre cursurile de înot."
            />

            <div className="container mx-auto px-6 mt-8 max-w-5xl">
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-10">
                    Ai o altă întrebare? Contactează echipa noastră prin{' '}
                    <a href="mailto:contact@atlantisswimschool.md" className="text-host-cyan hover:text-cyan-400 underline underline-offset-2 transition-colors">
                        trimiterea unui email
                    </a>{' '}
                    și îți vom răspunde cât mai curând.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {faqItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <h3 className="text-gray-800 dark:text-white font-semibold text-[15px] md:text-base mb-3 leading-snug">
                                {item.question}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                {item.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
