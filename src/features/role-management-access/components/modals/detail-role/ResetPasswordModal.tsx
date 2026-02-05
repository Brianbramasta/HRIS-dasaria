import React, { useState, useEffect } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: { password: string; passwordPenggajian: string }) => void;
    data: {
        nip: string;
        nama: string;
    } | null;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    data,
}) => {
    const [form, setForm] = useState({
        password: '',
        passwordPenggajian: '',
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                password: '',
                passwordPenggajian: '',
            });
        }
    }, [isOpen]);

    const generateRandomPassword = (fieldName: 'password' | 'passwordPenggajian') => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let result = '';
        for (let i = 0; i < 12; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setForm((prev) => ({ ...prev, [fieldName]: result }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleSubmit = () => {
        onSubmit(form);
        onClose();
    };

    const content = (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="NIP"
                    type="text"
                    value={data?.nip || ''}
                    readonly
                    disabled
                />
                <InputField
                    label="Nama"
                    type="text"
                    value={data?.nama || ''}
                    readonly
                    disabled
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Password Baru"
                    type="password"
                    placeholder="Inputkan manual rek"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    suffix={
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => generateRandomPassword('password')}
                                className="cursor-pointer"
                                title="Generate random password"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_428_21047)">
                                        <path d="M2.1219 5.08719C2.12194 5.08707 1.83896 4.28896 1.83896 4.28896C1.72364 3.96307 1.36629 3.79339 1.04131 3.90875C0.716029 4.02407 0.545741 4.38113 0.661098 4.70641L1.42549 6.86255C1.52555 7.14359 1.82279 7.31197 2.11392 7.2708C2.11392 7.27084 4.48796 6.88819 4.48796 6.88819C4.8288 6.83326 5.06039 6.51225 5.00546 6.17172C4.95057 5.83117 4.6283 5.59744 4.28899 5.65417L3.1218 5.84215C4.56697 3.43027 7.17477 1.92469 10.048 1.92469C14.5007 1.92469 18.1234 5.54739 18.1234 10.0001C18.1234 10.3455 18.4029 10.625 18.7484 10.625C19.0938 10.625 19.3733 10.3455 19.3733 10.0001C19.2941 0.623192 7.07654 -2.81286 2.1219 5.08719Z" fill="#6C757D" />
                                        <path d="M18.5725 13.1377C18.4735 12.8623 18.1744 12.6853 17.8841 12.7294L15.5107 13.1121C15.1701 13.167 14.9382 13.488 14.9932 13.8286C15.0481 14.1691 15.3673 14.4016 15.7096 14.3461L16.8759 14.1581C15.4314 16.57 12.8236 18.0756 9.9503 18.0756C5.49759 18.0756 1.87489 14.4529 1.87489 10.0002C1.87489 9.65475 1.59508 9.37524 1.24996 9.37524C0.904844 9.37524 0.625 9.65475 0.625 10.0002C0.703888 19.3771 12.9222 22.8131 17.8764 14.9131C18.0512 15.3203 18.1459 16.1577 18.7483 16.1275C19.169 16.1341 19.4872 15.6908 19.3372 15.2939L18.5725 13.1377Z" fill="#6C757D" />
                                        <path d="M9.99844 5.3252C8.53592 5.3252 7.34219 6.51896 7.34219 7.98145V8.60645H6.52344C6.17969 8.60645 5.89844 8.8877 5.89844 9.23145V14.0502C5.89844 14.394 6.17969 14.6752 6.52344 14.6752H13.4734C13.8172 14.6752 14.0984 14.394 14.0984 14.0502V9.23145C14.0984 8.8877 13.8172 8.60645 13.4734 8.60645H12.6547V7.98145C12.6547 6.51896 11.461 5.3252 9.99844 5.3252ZM11.4047 8.60645H8.59219V7.98145C8.59219 7.20645 9.22344 6.5752 9.99844 6.5752C10.7734 6.5752 11.4047 7.20645 11.4047 7.98145V8.60645Z" fill="#6C757D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_428_21047">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(form.password)}
                                className="cursor-pointer"
                                title="Copy to clipboard"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.7 1.66675H9.455C7.985 1.66675 6.82 1.66675 5.90917 1.79008C4.97083 1.91675 4.21167 2.18341 3.61333 2.78425C3.01417 3.38508 2.74833 4.14758 2.6225 5.08925C2.5 6.00425 2.5 7.17341 2.5 8.64925V13.5142C2.5 14.7709 3.26667 15.8476 4.35583 16.2992C4.3 15.5409 4.3 14.4784 4.3 13.5934V9.41841C4.3 8.35091 4.3 7.43008 4.39833 6.69341C4.50417 5.90341 4.7425 5.14675 5.35417 4.53258C5.96583 3.91841 6.72 3.67925 7.50667 3.57258C8.24 3.47425 9.15667 3.47425 10.2208 3.47425H12.7792C13.8425 3.47425 14.7575 3.47425 15.4917 3.57258C15.2718 3.01116 14.8878 2.52903 14.3898 2.18907C13.8918 1.8491 13.303 1.66709 12.7 1.66675Z" fill="#6C757D" />
                                    <path d="M5.5 9.49739C5.5 7.22572 5.5 6.08989 6.20333 5.38406C6.90583 4.67822 8.03667 4.67822 10.3 4.67822H12.7C14.9625 4.67822 16.0942 4.67822 16.7975 5.38406C17.5008 6.08989 17.5 7.22572 17.5 9.49739V13.5141C17.5 15.7857 17.5 16.9216 16.7975 17.6274C16.0942 18.3332 14.9625 18.3332 12.7 18.3332H10.3C8.0375 18.3332 6.90583 18.3332 6.20333 17.6274C5.5 16.9216 5.5 15.7857 5.5 13.5141V9.49739Z" fill="#6C757D" />
                                </svg>
                            </button>
                        </div>
                    }
                />
                <InputField
                    label="Password Penggajian Baru"
                    type="password"
                    placeholder="Inputkan manual rek"
                    value={form.passwordPenggajian}
                    onChange={(e) => setForm((prev) => ({ ...prev, passwordPenggajian: e.target.value }))}
                    suffix={
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => generateRandomPassword('passwordPenggajian')}
                                className="cursor-pointer"
                                title="Generate random password"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_428_21047)">
                                        <path d="M2.1219 5.08719C2.12194 5.08707 1.83896 4.28896 1.83896 4.28896C1.72364 3.96307 1.36629 3.79339 1.04131 3.90875C0.716029 4.02407 0.545741 4.38113 0.661098 4.70641L1.42549 6.86255C1.52555 7.14359 1.82279 7.31197 2.11392 7.2708C2.11392 7.27084 4.48796 6.88819 4.48796 6.88819C4.8288 6.83326 5.06039 6.51225 5.00546 6.17172C4.95057 5.83117 4.6283 5.59744 4.28899 5.65417L3.1218 5.84215C4.56697 3.43027 7.17477 1.92469 10.048 1.92469C14.5007 1.92469 18.1234 5.54739 18.1234 10.0001C18.1234 10.3455 18.4029 10.625 18.7484 10.625C19.0938 10.625 19.3733 10.3455 19.3733 10.0001C19.2941 0.623192 7.07654 -2.81286 2.1219 5.08719Z" fill="#6C757D" />
                                        <path d="M18.5725 13.1377C18.4735 12.8623 18.1744 12.6853 17.8841 12.7294L15.5107 13.1121C15.1701 13.167 14.9382 13.488 14.9932 13.8286C15.0481 14.1691 15.3673 14.4016 15.7096 14.3461L16.8759 14.1581C15.4314 16.57 12.8236 18.0756 9.9503 18.0756C5.49759 18.0756 1.87489 14.4529 1.87489 10.0002C1.87489 9.65475 1.59508 9.37524 1.24996 9.37524C0.904844 9.37524 0.625 9.65475 0.625 10.0002C0.703888 19.3771 12.9222 22.8131 17.8764 14.9131C18.0512 15.3203 18.1459 16.1577 18.7483 16.1275C19.169 16.1341 19.4872 15.6908 19.3372 15.2939L18.5725 13.1377Z" fill="#6C757D" />
                                        <path d="M9.99844 5.3252C8.53592 5.3252 7.34219 6.51896 7.34219 7.98145V8.60645H6.52344C6.17969 8.60645 5.89844 8.8877 5.89844 9.23145V14.0502C5.89844 14.394 6.17969 14.6752 6.52344 14.6752H13.4734C13.8172 14.6752 14.0984 14.394 14.0984 14.0502V9.23145C14.0984 8.8877 13.8172 8.60645 13.4734 8.60645H12.6547V7.98145C12.6547 6.51896 11.461 5.3252 9.99844 5.3252ZM11.4047 8.60645H8.59219V7.98145C8.59219 7.20645 9.22344 6.5752 9.99844 6.5752C10.7734 6.5752 11.4047 7.20645 11.4047 7.98145V8.60645Z" fill="#6C757D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_428_21047">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(form.passwordPenggajian)}
                                className="cursor-pointer"
                                title="Copy to clipboard"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.7 1.66675H9.455C7.985 1.66675 6.82 1.66675 5.90917 1.79008C4.97083 1.91675 4.21167 2.18341 3.61333 2.78425C3.01417 3.38508 2.74833 4.14758 2.6225 5.08925C2.5 6.00425 2.5 7.17341 2.5 8.64925V13.5142C2.5 14.7709 3.26667 15.8476 4.35583 16.2992C4.3 15.5409 4.3 14.4784 4.3 13.5934V9.41841C4.3 8.35091 4.3 7.43008 4.39833 6.69341C4.50417 5.90341 4.7425 5.14675 5.35417 4.53258C5.96583 3.91841 6.72 3.67925 7.50667 3.57258C8.24 3.47425 9.15667 3.47425 10.2208 3.47425H12.7792C13.8425 3.47425 14.7575 3.47425 15.4917 3.57258C15.2718 3.01116 14.8878 2.52903 14.3898 2.18907C13.8918 1.8491 13.303 1.66709 12.7 1.66675Z" fill="#6C757D" />
                                    <path d="M5.5 9.49739C5.5 7.22572 5.5 6.08989 6.20333 5.38406C6.90583 4.67822 8.03667 4.67822 10.3 4.67822H12.7C14.9625 4.67822 16.0942 4.67822 16.7975 5.38406C17.5008 6.08989 17.5 7.22572 17.5 9.49739V13.5141C17.5 15.7857 17.5 16.9216 16.7975 17.6274C16.0942 18.3332 14.9625 18.3332 12.7 18.3332H10.3C8.0375 18.3332 6.90583 18.3332 6.20333 17.6274C5.5 16.9216 5.5 15.7857 5.5 13.5141V9.49739Z" fill="#6C757D" />
                                </svg>
                            </button>
                        </div>
                    }
                />
            </div>
        </div>
    );

    return (
        <ModalAddEdit
            title="Atur Ulang Kata Sandi"
            isOpen={isOpen}
            onClose={onClose}
            content={content}
            handleSubmit={handleSubmit}
            submitting={false}
            maxWidth="max-w-2xl"
            confirmTitleButton="Simpan Perubahan"
            closeTitleButton="Tutup"
        />
    );
};

export default ResetPasswordModal;
