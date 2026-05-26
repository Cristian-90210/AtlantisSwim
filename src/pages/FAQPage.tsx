import React from 'react';
import { PageHeader } from '../components/PageHeader';

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: 'Unde au loc antrenamentele?',
        answer: 'Antrenamentele noastre au loc în incinta zonei Aquacenter din cadrul Chișinău arena.',
    },
    {
        question: 'Cât durează un antrenament?',
        answer: 'Un antrenament de grup sau individual durează în medie 45 de minute.',
    },
    {
        question: 'De la ce vârstă poate începe un copil să înoate?',
        answer: 'Copiii pot începe inițierea în înot de la 4 ani, într-un cadru sigur și adaptat nevoilor lor.',
    },
    {
        question: 'În cât timp se învață un copil a înota?',
        answer: 'Fiecare copil are ritmul său de progres. În general, bazele înotului se deprind după 2–3 luni de antrenamente regulate.',
    },
    {
        question: 'Câți copii sunt în grupe?',
        answer: 'Grupele sunt formate din 12–16 copii, pentru ca fiecare să primească atenția necesară din partea antrenorului.',
    },
    {
        question: 'Cum pot înscrie copilul la antrenamente?',
        answer: 'Înscrierea se face telefonic sau online, prin completarea formularului de pe site.',
    },
    {
        question: 'Trebuie adus echipament special?',
        answer: 'Da, fiecare sportiv are nevoie de costum de baie, cască, ochelari, prosop și papuci. Restul echipamentului este asigurat de club.',
    },
    {
        question: 'Se pot recupera antrenamentele lipsă?',
        answer: 'Antrenamentele de grup se pot recupera, doar dacă sunt pe motiv de boală și cu programare prealabilă. Recuperarea e valabilă doar pe perioada abonamentului activ.\n\nAntrenamentele anulate cu o zi înainte pot fi reprogramate.\n\nAntrenamentele anulate în ziua programării nu se recuperează.',
    },
];

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
