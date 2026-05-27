import React from 'react';
import { Clock3, Waves, Trophy, HeartPulse } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

const newsItems = [
    {
        title: 'Cum alegi cursa potrivită pentru copilul tău',
        excerpt:
            'Înainte de înscriere, contează vârsta, nivelul de siguranță în apă și obiectivul principal: acomodare, tehnică sau performanță.',
        date: '17 martie 2026',
        category: 'Ghid pentru părinți',
        icon: HeartPulse,
    },
    {
        title: '5 exerciții simple pentru îmbunătățirea respirației în înot',
        excerpt:
            'Respirația controlată influențează direct ritmul, rezistența și încrederea copilului în bazin. Exercițiile corecte reduc oboseala rapidă.',
        date: '14 martie 2026',
        category: 'Tehnică',
        icon: Waves,
    },
    {
        title: 'Ce înseamnă progres sănătos la înot în primele 3 luni',
        excerpt:
            'Progresul real nu se măsoară doar în viteză. Poziția corpului, coordonarea și confortul în apă sunt semnele cele mai importante la început.',
        date: '10 martie 2026',
        category: 'Progres',
        icon: Trophy,
    },
    {
        title: 'Rutina ideală înainte de antrenament',
        excerpt:
            'O rutină scurtă de încălzire, hidratare și organizare a echipamentului ajută copilul să intre mai concentrat și mai sigur în lecție.',
        date: '6 martie 2026',
        category: 'Pregătire',
        icon: Clock3,
    },
];

export const NewsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader
                title={<>NOUTĂȚI DIN <span className="text-host-cyan">ÎNOT</span></>}
                subtitle="O pagină dedicată informațiilor utile, recomandărilor practice și actualizărilor despre lumea înotului."
            />

            <div className="container mx-auto px-6 mt-8 max-w-6xl">
                <div className="mb-10 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 bg-white dark:bg-gray-800 p-6 md:p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-host-cyan mb-3">
                        Pagina de noutăți
                    </p>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                        Aici vor fi publicate noutăți actuale despre înot
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                        Secțiunea este pregătită pentru articole noi, recomandări pentru părinți,
                        sfaturi tehnice pentru elevi și informații relevante despre antrenamente,
                        recuperare și dezvoltarea corectă în apă.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {newsItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.title}
                                className="group rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between gap-4 mb-6">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 dark:bg-cyan-950/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-host-cyan">
                                        <Icon size={14} />
                                        {item.category}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {item.date}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-host-cyan transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                    {item.excerpt}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
