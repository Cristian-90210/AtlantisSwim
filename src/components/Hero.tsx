import { useTranslation } from 'react-i18next';

export const Hero: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="relative min-h-screen pt-20 md:pt-24 flex items-center justify-center overflow-hidden bg-host-gradient animate-gradient-x">
            {/* Fluid Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                {/* Large textured blobs for "water depth" feel */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] bg-host-blue/40 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>

                {/* Subtle overlay for noise/texture if needed, kept clean for now */}
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                {/* Main Heading */}
                <div className="mb-8 animate-in slide-in-from-bottom-5 duration-700 fade-in">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-sm">
                        Atlantis Swim School
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-host-cyan to-white">
                            {t('hero.platform_title')}
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100/90 font-light max-w-2xl mx-auto leading-relaxed">
                        {t('hero.subtitle')}
                    </p>
                </div>

                {/* Legend container - Restored wrapper */}
                <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000 fade-in fill-mode-backwards delay-200">
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200/80 font-medium">
                        <div className="flex items-center space-x-2 animate-float">
                            <span className="w-3 h-3 bg-host-cyan rounded-full shadow-[0_0_10px_#00c6ff]"></span>
                            <span>{t('hero.levels.beginner')}</span>
                        </div>
                        <div className="flex items-center space-x-2 animate-float-delayed">
                            <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></span>
                            <span>{t('hero.levels.intermediate')}</span>
                        </div>
                        <div className="flex items-center space-x-2 animate-float" style={{ animationDelay: '1s' }}>
                            <span className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></span>
                            <span>{t('hero.levels.advanced')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
