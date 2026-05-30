import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { CTAButton } from '../components/CTAButton';
import { CartToast } from '../components/CartToast';
import { swimmingServiceService } from '../services/api';
import type { SwimmingServiceItem } from '../services/api';
import { Tag } from 'lucide-react';
import { SubscriptionInfoModal } from '../components/SubscriptionInfoModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Extract session count from service description text, e.g. "8 lecții", "24 de lecții", "5 ședințe"
function parseSessions(description: string): number {
    const match = description?.match(/(\d+)\s+(?:de\s+)?(?:lecții|antrenamente|ședințe)/i);
    return match ? parseInt(match[1], 10) : 1;
}

export const Courses: React.FC = () => {
    const { addItem, items } = useCart();
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [plans, setPlans] = useState<SwimmingServiceItem[]>([]);

    useEffect(() => {
        swimmingServiceService.getAll().then(setPlans);
    }, []);

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const selectedPlan = plans.find(p => String(p.id) === selectedPlanId);

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
                        {plans.map((plan) => {
                            const planId = String(plan.id);
                            return (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlanId(planId)}
                                    className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                                >
                                    {/* Category badge */}
                                    <div className="flex justify-start items-start mb-4">
                                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-blue-400">
                                            <Tag size={12} />
                                            <span>{t('landing.subscriptions.standard')}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 pr-8 leading-tight">
                                        {plan.serviceName}
                                    </h3>

                                    {plan.serviceDescription && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                                            {plan.serviceDescription}
                                        </p>
                                    )}

                                    {/* Price */}
                                    <div className="mt-auto">
                                        <div className="flex items-baseline space-x-2 mb-5">
                                            <span className="text-3xl font-extrabold text-host-cyan">
                                                {plan.servicePrice}
                                            </span>
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">MDL</span>
                                        </div>

                                        {/* Add to cart button */}
                                        <CTAButton
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                if (!isAuthenticated) {
                                                    navigate('/login', { state: { from: location } });
                                                    return;
                                                }
                                                addItem({
                                                    id: planId,
                                                    name: plan.serviceName,
                                                    price: plan.servicePrice,
                                                    sessionsTotal: parseSessions(plan.serviceDescription),
                                                });
                                            }}
                                            style={items.some(i => i.id === planId) ? {
                                                borderRadius: '9999px',
                                                background: 'linear-gradient(145deg, #22c55e 0%, #16a34a 100%)',
                                                minHeight: '44px',
                                            } : undefined}
                                            className="w-full"
                                        >
                                            {items.some(i => i.id === planId) ? (
                                                <><span>{t('courses_page.added_to_cart', { count: items.find(i => i.id === planId)?.quantity })}</span></>
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
                    planId={`plan${selectedPlan.id}`}
                    name={selectedPlan.serviceName}
                    price={selectedPlan.servicePrice}
                    discountPrice={null}
                    category={t('landing.subscriptions.standard')}
                    onSelect={() => {
                        setSelectedPlanId(null);
                        if (!isAuthenticated) {
                            navigate('/login', { state: { from: location } });
                            return;
                        }
                        addItem({
                            id: String(selectedPlan.id),
                            name: selectedPlan.serviceName,
                            price: selectedPlan.servicePrice,
                            sessionsTotal: parseSessions(selectedPlan.serviceDescription),
                        });
                    }}
                />
            )}
        </div>
    );
};
