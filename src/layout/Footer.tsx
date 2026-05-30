import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Facebook } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { MapFooter } from '../components/MapFooter';

const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-host-gradient text-blue-100/80 pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
            {/* Subtle animated background effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <img src="https://atlantisswim.md/wp-content/uploads/2025/08/cropped-asat-03-scaled-1-e1755890850322.png" alt="Atlantis SwimSchool" className="h-10 w-10 object-contain" />
                            <span className="text-2xl font-extrabold text-white tracking-wider">
                                ATLANTIS <span className="text-host-cyan">SWIMSCHOOL</span>
                            </span>
                        </div>
                        <p className="text-blue-200/70 text-sm leading-relaxed max-w-xs">
                            {t('footer.brand_description')}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white hover:scale-110 transition-all duration-300">
                                <Facebook size={20} />
                            </a>
                            <a href="https://instagram.com/atlantis.swim.academy" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white hover:scale-110 transition-all duration-300">
                                <Instagram size={20} />
                            </a>
                            <a href="https://wa.me/37360039212" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white hover:scale-110 transition-all duration-300">
                                <WhatsAppIcon />
                            </a>
                            <a href="mailto:swimacademyatlantis@gmail.com" className="text-blue-300 hover:text-white hover:scale-110 transition-all duration-300">
                                <Mail size={20} />
                            </a>
                            <a href="tel:+37360039212" className="text-blue-300 hover:text-white hover:scale-110 transition-all duration-300">
                                <Phone size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                            {t('footer.quick_links')}
                            <span className="absolute bottom-[-8px] left-0 w-12 h-1 bg-host-cyan rounded-full"></span>
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { key: 'courses', label: t('footer.links.courses'), to: '/courses' },
                                { key: 'team',    label: t('footer.links.team'),    to: '/team' },
                                { key: 'faq',     label: t('footer.links.faq'),     to: '/faq' },
                            ].map((link) => (
                                <li key={link.key}>
                                    <Link to={link.to} className="flex items-center hover:text-host-cyan transition-all duration-300 group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-host-cyan mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                            {t('footer.contact_us')}
                            <span className="absolute bottom-[-8px] left-0 w-12 h-1 bg-host-cyan rounded-full"></span>
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-host-cyan mr-3 mt-0.5 flex-shrink-0" />
                                <span>Chișinău Arena</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-host-cyan mr-3 flex-shrink-0" />
                                <a href="mailto:swimacademyatlantis@gmail.com" className="hover:text-white transition-colors">swimacademyatlantis@gmail.com</a>
                            </li>
                            <li className="flex items-start">
                                <Phone className="w-5 h-5 text-host-cyan mr-3 mt-0.5 flex-shrink-0" />
                                <div className="flex flex-col space-y-1">
                                    <a href="tel:+37360039212" className="hover:text-white transition-colors">+373 60039212</a>
                                    <a href="tel:+37360382044" className="hover:text-white transition-colors">+373 60382044</a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Map Section */}
                    <div className="w-full h-full min-h-[250px] lg:col-span-1">
                        <div className="lg:mt-0"> {/* Adjust spacing if needed */}
                            <MapFooter />
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-blue-300/50">
                    <p>{t('footer.rights_reserved', { year: new Date().getFullYear() })}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">{t('footer.privacy_policy')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('footer.terms_of_service')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('footer.cookie_policy')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
