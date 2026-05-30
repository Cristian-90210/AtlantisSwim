import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Tag } from 'lucide-react';
import { swimmingServiceService } from '../services/api';
import type { SwimmingServiceItem } from '../services/api';
import { CTAButton } from '../components/CTAButton';
import { useCart } from '../context/CartContext';

const detailByPlanId: Record<string, { description: string; schedule: string[]; image: string }> = {
    plan1: {
        image: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755791387916257-scaled.jpg',
        description: 'Acest abonament include 4 lecții de înot, desfășurate pe parcursul a 4 săptămâni. Lecțiile se desfășoară în grup, iar un antrenament durează 45 de minute.',
        schedule: ['Luni & Miercuri: 17:00, 18:00, 19:00', 'Marți & Joi: 17:00, 18:00, 19:00', 'Weekend: Sâmbătă & Duminică - 10:00, 11:00, 12:00'],
    },
    plan2: {
        image: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755791394434546-scaled.jpg',
        description: 'Acest abonament include 8 lecții de înot, desfășurate pe parcursul a 4 săptămâni. Lecțiile se desfășoară în grup, iar un antrenament durează 45 de minute!',
        schedule: ['Luni & Miercuri: 17:00, 18:00, 19:00', 'Marți & Joi: 16:00, 17:00, 18:00, 19:00', 'Weekend: Sâmbătă & Duminică - 10:00, 11:00, 12:00'],
    },
    plan3: {
        image: 'https://atlantisswim.md/wp-content/uploads/2022/11/175560875357502-1536x2048.jpg',
        description: 'Abonamentul Pro include 12 antrenamente pe parcursul a 4 săptămâni, cu frecvență de 3 ședințe pe săptămână. Un antrenament durează 45 de minute.',
        schedule: ['Luni, Miercuri, Vineri: 17:00, 18:00, 19:00', 'Marți, Joi, Vineri: 17:00, 18:00, 19:00'],
    },
    plan4: {
        image: 'https://atlantisswim.md/wp-content/uploads/2025/08/175560879720414-1536x2048.jpg',
        description: 'Abonamentul include 24 de lecții de înot pe parcursul a 12 săptămâni. Alegerea potrivită pentru progres constant și stabil.',
        schedule: ['Luni & Miercuri: 17:00, 18:00, 19:00', 'Marți & Joi: 16:00, 17:00, 18:00, 19:00', 'Weekend: Sâmbătă & Duminică - 10:00, 11:00, 12:00'],
    },
    plan5: {
        image: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755608799148271-scaled.jpg',
        description: 'Abonamentul include 36 de lecții de înot pe parcursul a 12 săptămâni. Ideal pentru cei care doresc să evolueze rapid și să perfecționeze tehnica.',
        schedule: ['Luni, Miercuri, Vineri: 17:00, 18:00, 19:00', 'Marți, Joi, Vineri: 17:00, 18:00, 19:00'],
    },
    plan6: {
        image: 'https://atlantisswim.md/wp-content/uploads/2025/08/175560879055773-scaled.jpg',
        description: 'Cursul Individual include 5 ședințe personalizate 1 la 1 cu antrenorul, adaptate ritmului și obiectivelor cursantului.',
        schedule: ['Flexibil, în funcție de disponibilitatea antrenorului și a cursantului.', 'Antrenamentele anulate cu o zi înainte pot fi reprogramate.'],
    },
    plan7: {
        image: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755608863802712-1-scaled.jpg',
        description: 'Cursul Individual include 10 ședințe personalizate pe parcursul a 5 săptămâni, cu reducere de 7% la pachetul de 10.',
        schedule: ['Flexibil, în funcție de disponibilitatea antrenorului și a cursantului.', 'Antrenamentele anulate cu o zi înainte pot fi reprogramate.'],
    },
    plan8: {
        image: 'https://atlantisswim.md/wp-content/uploads/2025/09/542081340_18064308863363900_4440822476891816333_n.jpg',
        description: 'Chișinău hai la înot. Transport tur-retur inclus și antrenamente de grup la bazinul Aquacenter. Include 8 antrenamente în 4 săptămâni.',
        schedule: ['Transport tur-retur inclus din sectorul de domiciliu (Chișinău).', 'Antrenamente de grup la bazinul Aquacenter, Arena Chișinău.'],
    },
    plan9: {
        image: 'https://atlantisswim.md/wp-content/uploads/2022/11/1755608905796779-scaled.jpg',
        description: 'Ialoveni hai la înot. Transport tur-retur din Ialoveni și antrenamente de grup. Include 8 antrenamente în 4 săptămâni.',
        schedule: ['Transport tur-retur inclus din orașul Ialoveni.', 'Antrenamente de grup la bazin (Arena Chișinău).'],
    },
};

const fallbackDetail = {
    image: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755791387916257-scaled.jpg',
    description: 'Abonament de înot cu antrenamente desfășurate în grupuri organizate.',
    schedule: ['Luni & Miercuri: 17:00, 18:00', 'Marți & Joi: 17:00, 19:00'],
};

export const SubscriptionDetails: React.FC = () => {
    const { planId } = useParams();
    const { addItem, items } = useCart();
    const [plans, setPlans] = useState<SwimmingServiceItem[]>([]);

    useEffect(() => {
        swimmingServiceService.getAll().then(setPlans);
    }, []);

    const plan = plans.find(p => String(p.id) === planId || `plan${p.id}` === planId);

    if (plans.length > 0 && !plan) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-8">
                <section className="pt-24 pb-5 bg-host-gradient border-b border-white/10">
                    <div className="container mx-auto px-6">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            ABONAMENT <span className="text-host-cyan">INEXISTENT</span>
                        </h1>
                        <p className="text-blue-100/90 mt-2 text-sm md:text-base">
                            Abonamentul selectat nu a fost găsit.
                        </p>
                    </div>
                </section>
                <div className="container mx-auto px-6 mt-5">
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-host-cyan text-white font-bold"
                    >
                        <ArrowLeft size={16} />
                        Înapoi la abonamente
                    </Link>
                </div>
            </div>
        );
    }

    if (!plan) return null;

    const inCart = items.some(item => item.id === String(plan.id));
    const qty = items.find(item => item.id === String(plan.id))?.quantity ?? 0;
    const detail = detailByPlanId[`plan${plan.id}`] ?? fallbackDetail;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-8">
            <section className="pt-24 pb-5 bg-host-gradient border-b border-white/10">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        DETALII <span className="text-host-cyan">ABONAMENT</span>
                    </h1>
                    <p className="text-blue-100/90 mt-2 text-sm md:text-base">
                        Aici vezi mai multe informații despre abonamentul selectat.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 mt-5">
                <div className="mb-4">
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-host-cyan font-bold"
                    >
                        <ArrowLeft size={16} />
                        Înapoi la abonamente
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                        <div className="w-full max-w-[440px] mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30">
                            <img
                                src={detail.image}
                                alt={plan.serviceName}
                                className="w-full h-[390px] object-cover"
                            />
                        </div>

                        <div>
                            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-host-cyan">
                                <Tag size={12} />
                                Standard
                            </p>
                            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                {plan.serviceName}
                            </h2>

                            <div className="mt-3 flex items-end gap-3">
                                <span className="text-4xl font-extrabold text-host-cyan">{plan.servicePrice} MDL</span>
                            </div>

                            <CTAButton
                                onClick={() => addItem({
                                    id: String(plan.id),
                                    name: plan.serviceName,
                                    price: plan.servicePrice,
                                })}
                                style={inCart ? {
                                    borderRadius: '9999px',
                                    background: 'linear-gradient(145deg, #22c55e 0%, #16a34a 100%)',
                                    minHeight: '44px',
                                } : undefined}
                                className="mt-4 max-w-xs"
                            >
                                <ShoppingCart size={16} className="mr-2" />
                                <span>{inCart ? `Adăugat în coș (${qty})` : 'ADĂUGĂ ÎN COȘ'}</span>
                            </CTAButton>

                            <p className="mt-5 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                {plan.serviceDescription || detail.description}
                            </p>

                            <div className="mt-4">
                                <p className="text-lg font-bold text-gray-800 dark:text-white">Program disponibil:</p>
                                <ul className="mt-2 space-y-1.5 text-base text-gray-700 dark:text-gray-300 list-disc pl-5">
                                    {detail.schedule.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
