import React from 'react';
import { useTranslation } from 'react-i18next';

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export const FAQ: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div id="faq-section" className="py-20 relative">
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                {/* Header */}
                <div className="scroll-reveal reveal-up text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        {t('faq.title')}{' '}
                        <span className="text-host-cyan">{t('faq.title_highlight')}</span>
                    </h2>
                    <p className="text-blue-200/60 max-w-2xl mx-auto text-base leading-relaxed">
                        {t('faq.subtitle')}
                    </p>
                    <p className="text-blue-200/50 max-w-2xl mx-auto text-sm mt-3 leading-relaxed">
                        {t('faq.contact_text')}{' '}
                        <a href="mailto:contact@atlantisswimschool.md" className="text-host-cyan hover:text-cyan-300 underline underline-offset-2 transition-colors">
                            {t('faq.contact_link')}
                        </a>{' '}
                        {t('faq.contact_suffix')}
                    </p>
                </div>

                {/* 2-column card grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {FAQ_KEYS.map((key, idx) => (
                        <div
                            key={key}
                            className={`scroll-reveal reveal-up stagger-${Math.min(idx + 1, 6)} bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-7 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300`}
                        >
                            <h3 className="text-white font-semibold text-[15px] md:text-base mb-3 leading-snug">
                                {t(`faq.${key}.q`)}
                            </h3>
                            <p className="text-blue-200/50 text-sm leading-relaxed whitespace-pre-line">
                                {t(`faq.${key}.a`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
