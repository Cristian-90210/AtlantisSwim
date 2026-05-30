import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Calendar } from './Calendar';
import { CoachSelector } from './CoachSelector';
import { Button } from './Button';
import { CTAButton } from './CTAButton';
import { coachService, reservationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Course, Coach } from '../types';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EnrollmentModalProps {
    course: Course | null;
    isOpen: boolean;
    onClose: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ course, isOpen, onClose }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    useEffect(() => {
        if (isOpen) {
            coachService.getAll().then(setCoaches);
        } else {
            setStep(1);
            setSelectedDate(null);
            setSelectedTime(null);
            setSelectedCoachId(null);
            setBookingError(null);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (!user || !course || !selectedDate || !selectedTime || !selectedCoachId) return;
        setIsSaving(true);
        setBookingError(null);
        try {
            await reservationService.create({
                studentUserId: parseInt(user.id, 10),
                coachUserId:   parseInt(selectedCoachId, 10),
                courseId:      parseInt(course.id, 10),
                date:          selectedDate.toISOString().split('T')[0],
                time:          selectedTime,
            });
            onClose();
        } catch {
            setBookingError('Rezervarea nu a putut fi creată. Încearcă din nou.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!course) return null;

    const selectedCoach = coaches.find(c => c.id === selectedCoachId);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('enrollment_modal.enroll_in', { course: course.title })}>
            {/* Progress Stepper */}
            <div className="flex justify-between items-center mb-8 px-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                {[1, 2, 3].map(i => (
                    <div key={i} className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 
                        ${step >= i ? 'bg-host-cyan text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}
                    `}>
                        {i}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[300px]">
                {step === 1 && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('enrollment_modal.step_1_title')}</h3>
                            <p className="text-sm text-gray-500">Select when you'd like to start your training.</p>
                        </div>
                        <Calendar
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            selectedTime={selectedTime}
                            onTimeSelect={setSelectedTime}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('enrollment_modal.step_2_title')}</h3>
                            <p className="text-sm text-gray-500">Choose your preferred instructor for this course.</p>
                        </div>
                        <CoachSelector selectedCoachId={selectedCoachId} onSelect={setSelectedCoachId} />
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in slide-in-from-right-4 duration-300 text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('enrollment_modal.step_3_title')}</h3>
                        <p className="text-gray-500 mb-8">{t('enrollment_modal.confirm_subtitle')}</p>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-left space-y-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-500 text-sm">{t('enrollment_modal.course')}</span>
                                <span className="font-bold text-host-blue">{course.title}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-gray-500 text-sm">{t('footer.links.schedule')}</span>
                                <span className="font-bold text-gray-800 dark:text-white">
                                    {selectedDate?.toLocaleDateString()} at {selectedTime}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">{t('enrollment_modal.coach')}</span>
                                <div className="flex items-center">
                                    <img src={selectedCoach?.avatar} className="w-6 h-6 rounded-full mr-2" />
                                    <span className="font-bold text-gray-800 dark:text-white">{selectedCoach?.name}</span>
                                </div>
                            </div>
                        </div>

                        {bookingError && (
                            <p className="mt-4 text-sm text-red-500 font-medium">{bookingError}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                {step > 1 ? (
                    <Button variant="ghost" onClick={handleBack}>{t('enrollment_modal.back')}</Button>
                ) : (
                    <div></div> // Spacer
                )}

                {step < 3 ? (
                    <CTAButton
                        onClick={handleNext}
                        fullWidth={false}
                        disabled={(step === 1 && (!selectedDate || !selectedTime)) || (step === 2 && !selectedCoachId)}
                    >
                        {t('enrollment_modal.next')}
                    </CTAButton>
                ) : (
                    <CTAButton
                        onClick={handleConfirm}
                        fullWidth={false}
                        disabled={isSaving}
                        style={{ borderRadius: '9999px', background: 'linear-gradient(145deg, #22c55e 0%, #16a34a 100%)', minHeight: '44px' }}
                    >
                        {isSaving ? 'Se salvează...' : t('enrollment_modal.confirm_booking')}
                    </CTAButton>
                )}
            </div>
        </Modal>
    );
};
