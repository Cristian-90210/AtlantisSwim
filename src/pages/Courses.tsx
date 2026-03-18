import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { CTAButton } from '../components/CTAButton';
import { CartToast } from '../components/CartToast';
import { subscriptionPlans } from '../data/mockData';
import { Clock, Tag, Zap, Car, User, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Courses: React.FC = () => {
    const { addItem, items } = useCart();
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const categoryLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
        standard: { label: 'Standard', icon: Tag, color: 'text-blue-400' },
        pro: { label: 'Pro', icon: Zap, color: 'text-purple-400' },
        individual: { label: 'Individual', icon: User, color: 'text-amber-400' },
        transport: { label: 'Cu Transport', icon: Car, color: 'text-green-400' },
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>ABONAMENTE <span className="text-host-cyan">& PREȚURI</span></>}
                subtitle="Alege abonamentul potrivit pentru tine. Prețurile sunt în lei moldovenești (MDL)."
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
                                    className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    {/* Category badge */}
                                    <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-gray-100 dark:bg-gray-700 ${cat.color}`}>
                                        <CatIcon size={12} />
                                        <span>{cat.label}</span>
                                    </div>

                                    {/* Savings badge */}
                                    {savings > 0 && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                                            -{savings} MDL
                                        </div>
                                    )}

                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 leading-tight">
                                        {plan.name}
                                    </h3>

                                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <Clock size={14} />
                                        <span>{plan.sessions} ședințe</span>
                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                        <span>{plan.duration}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-auto">
                                        {plan.discountPrice ? (
                                            <div className="flex items-end space-x-3">
                                                <span className="text-3xl font-extrabold text-host-cyan">
                                                    {plan.discountPrice}
                                                </span>
                                                <span className="text-lg text-gray-400 line-through mb-0.5">
                                                    {plan.price}
                                                </span>
                                                <span className="text-sm text-gray-500 mb-1">MDL</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-end space-x-2">
                                                <span className="text-3xl font-extrabold text-host-cyan">
                                                    {plan.price}
                                                </span>
                                                <span className="text-sm text-gray-500 mb-1">MDL</span>
                                            </div>
                                        )}
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
                                        className="mt-4"
                                    >
                                        {items.some(i => i.id === plan.id) ? (
                                            <><Check size={16} className="mr-2" /><span>Adăugat în coș ({items.find(i => i.id === plan.id)?.quantity})</span></>
                                        ) : (
                                            <><ShoppingCart size={16} className="mr-2" /><span>ADD TO CART</span></>
                                        )}
                                    </CTAButton>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <CartToast />
        </div>
    );
};
