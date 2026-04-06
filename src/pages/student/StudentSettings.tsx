import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../../components/PageHeader';
import { Bell, Moon, Sun, Globe, Shield, Eye, EyeOff } from 'lucide-react';
import {
    SettingsSection,
    SettingsToggleItem,
    SettingsSelectItem,
} from '../../components/settings/SettingsComponents';

export const StudentSettings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [scheduleReminders, setScheduleReminders] = useState(true);
    const [language, setLanguage] = useState('en');
    const [profileVisibility, setProfileVisibility] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader title="Settings" subtitle="Manage your account preferences and notifications" />

            <div className="container mx-auto px-6 mt-10 relative z-20 max-w-4xl space-y-6">
                {/* ── Notifications ── */}
                <SettingsSection
                    icon={Bell}
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-500"
                    title="Notifications"
                    description="Control how you receive updates"
                >
                    <SettingsToggleItem
                        id="toggle-email"
                        title="Email Notifications"
                        description="Receive updates about your courses via email"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                    />
                    <SettingsToggleItem
                        id="toggle-push"
                        title="Push Notifications"
                        description="Get notified about important events in real-time"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                    />
                    <SettingsToggleItem
                        id="toggle-reminders"
                        title="Schedule Reminders"
                        description="Remind me before upcoming swimming sessions"
                        checked={scheduleReminders}
                        onChange={() => setScheduleReminders(!scheduleReminders)}
                    />
                </SettingsSection>

                {/* ── Appearance ── */}
                <SettingsSection
                    icon={theme === 'light' ? Sun : Moon}
                    iconBg="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-500"
                    title="Appearance"
                    description="Customize the look and feel"
                >
                    <SettingsToggleItem
                        id="toggle-theme"
                        title="Dark Mode"
                        description="Switch between light and dark themes"
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                    />
                </SettingsSection>

                {/* ── Language ── */}
                <SettingsSection
                    icon={Globe}
                    iconBg="bg-green-100 dark:bg-green-900/30"
                    iconColor="text-green-500"
                    title="Language"
                    description="Choose your preferred language"
                >
                    <SettingsSelectItem
                        id="language-select"
                        title="Display Language"
                        description="The interface will be displayed in this language"
                        value={language}
                        onChange={setLanguage}
                        options={[
                            { value: 'en', label: '🇬🇧  English' },
                            { value: 'ro', label: '🇷🇴  Română' },
                            { value: 'ru', label: '🇷🇺  Русский' },
                        ]}
                    />
                </SettingsSection>

                {/* ── Privacy ── */}
                <SettingsSection
                    icon={Shield}
                    iconBg="bg-amber-100 dark:bg-amber-900/30"
                    iconColor="text-amber-500"
                    title="Privacy"
                    description="Manage your privacy preferences"
                >
                    <SettingsToggleItem
                        id="toggle-visibility"
                        title="Profile Visibility"
                        description="Allow coaches to view your full profile"
                        checked={profileVisibility}
                        onChange={() => setProfileVisibility(!profileVisibility)}
                        icon={profileVisibility ? Eye : EyeOff}
                        iconColor={profileVisibility ? 'text-host-cyan' : 'text-gray-400'}
                    />
                </SettingsSection>
            </div>
        </div>
    );
};
