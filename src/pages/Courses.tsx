import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { CTAButton } from '../components/CTAButton';
import { CartToast } from '../components/CartToast';
import { subscriptionPlans } from '../data/mockData';
import { Clock, Tag, Zap, Car, User } from 'lucide-react';
import { SubscriptionInfoModal } from '../components/SubscriptionInfoModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Courses: React.FC = () => {
    const { addItem, items } = useCart();
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const categoryLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
        standard: { label: t('landing.subscriptions.standard'), icon: Tag, color: 'text-blue-400' },
        pro: { label: t('landing.subscriptions.pro'), icon: Zap, color: 'text-purple-400' },
        individual: { label: t('landing.subscriptions.individual'), icon: User, color: 'text-amber-400' },
        transport: { label: t('landing.subscriptions.transport'), icon: Car, color: 'text-green-400' },
    };

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const selectedPlan = subscriptionPlans.find(p => p.id === selectedPlanId);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>{t('courses_page.plans_title')} <span className="text-host-cyan">{t('courses_page.plans_title_highlight')}</span></>}
                subtitle={t('courses_page.plans_subtitle')}
            />

            <div className="container mx-auto px-6 mt-8">
                {/* Subscription Plans Section */}
                <div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subscriptionPlans.map((plan) => {
                            const cat = categoryLabels[plan.category] || categoryLabels.standard;
                            const CatIcon = cat.icon;
                            const savings = plan.discountPrice ? plan.price - plan.discountPrice : 0;

                            return (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlanId(plan.id)}
                                    className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                                >
                                    {/* Category badge */}
                                    <div className="flex justify-start items-start mb-4">
                                        <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 ${cat.color}`}>
                                            <CatIcon size={12} />
                                            <span>{cat.label}</span>
                                        </div>
                                    </div>

                                    {/* Savings badge */}
                                    {savings > 0 && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                                            -{savings} MDL
                                        </div>
                                    )}

                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 pr-8 leading-tight">
                                        {t(`landing.plans.${plan.id}.name`)}
                                    </h3>

                                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                        <Clock size={14} />
                                        <span>{plan.sessions} {t('landing.subscriptions.sessions')}</span>
                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                        <span>{plan.duration}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-auto">
                                        {plan.discountPrice ? (
                                            <div className="flex items-baseline space-x-3 mb-5">
                                                <span className="text-3xl font-extrabold text-host-cyan">
                                                    {plan.discountPrice}
                                                </span>
                                                <span className="text-lg text-gray-400 line-through">
                                                    {plan.price}
                                                </span>
                                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">MDL</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline space-x-2 mb-5">
                                                <span className="text-3xl font-extrabold text-host-cyan">
                                                    {plan.price}
                                                </span>
                                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">MDL</span>
                                            </div>
                                        )}

                                        {/* Add to cart button */}
                                        <CTAButton
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                if (!isAuthenticated) {
                                                    navigate('/login', { state: { from: location } });
                                                    return;
                                                }
                                                addItem({
                                                    id: plan.id,
                                                    name: plan.name,
                                                    price: plan.price,
                                                    discountPrice: plan.discountPrice ?? undefined,
                                                });
                                            }}
                                            style={items.some(i => i.id === plan.id) ? {
                                                borderRadius: '9999px',
                                                background: 'linear-gradient(145deg, #22c55e 0%, #16a34a 100%)',
                                                minHeight: '44px',
                                            } : undefined}
                                            className="w-full"
                                        >
                                            {items.some(i => i.id === plan.id) ? (
                                                <><span>{t('courses_page.added_to_cart', { count: items.find(i => i.id === plan.id)?.quantity })}</span></>
                                            ) : (
                                                <><span>{t('landing.subscriptions.add_to_cart')}</span></>
                                            )}
                                        </CTAButton>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <CartToast />
            
            {selectedPlan && (
                <SubscriptionInfoModal
                    isOpen={!!selectedPlanId}
                    onClose={() => setSelectedPlanId(null)}
                    planId={selectedPlan.id}
                    name={t(`landing.plans.${selectedPlan.id}.name`)}
                    price={selectedPlan.price}
                    discountPrice={selectedPlan.discountPrice}
                    category={categoryLabels[selectedPlan.category]?.label || t('landing.subscriptions.standard')}
                    onSelect={() => {
                        setSelectedPlanId(null);
                        if (!isAuthenticated) {
                            navigate('/login', { state: { from: location } });
                            return;
                        }
                        addItem({
                            id: selectedPlan.id,
                            name: selectedPlan.name,
                            price: selectedPlan.price,
                            discountPrice: selectedPlan.discountPrice ?? undefined,
                        });
                    }}
                />
            )}
        </div>
    );
};
