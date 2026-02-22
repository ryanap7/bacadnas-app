import React, { createContext, ReactNode, useContext, useState } from 'react';

// ─── Types ──────────────────────────────────────────────────
export interface RegistrationData {
    // From login
    nik: string;

    // Step 1: Personal Data
    fullName: string;
    birthPlace: string;
    birthDate: string; // Format: YYYY-MM-DD
    gender: 'MALE' | 'FEMALE' | '';

    // Step 2: Address
    province: string;
    city: string;
    district: string;
    subDistrict: string; // village in your form
    postalCode: string;
    address: string; // fullAddress in your form

    // Step 3: Contact
    phone: string;
    expertise: string; // skills in your form

    // Program & Agreement
    selectedProgram: 'KOMCAD' | 'BELA_NEGARA' | 'VETERAN' | '';
    agreedToTerms: boolean;
}

interface RegistrationContextType {
    registrationData: RegistrationData;
    updateRegistrationData: (data: Partial<RegistrationData>) => void;
    resetRegistrationData: () => void;
}

// ─── Initial State ──────────────────────────────────────────
const initialRegistrationData: RegistrationData = {
    nik: '',
    fullName: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    province: '',
    city: '',
    district: '',
    subDistrict: '',
    postalCode: '',
    address: '',
    phone: '',
    expertise: '',
    selectedProgram: '',
    agreedToTerms: false,
};

// ─── Context ────────────────────────────────────────────────
const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────
export function RegistrationProvider({ children }: { children: ReactNode }) {
    const [registrationData, setRegistrationData] =
        useState<RegistrationData>(initialRegistrationData);

    const updateRegistrationData = (data: Partial<RegistrationData>) => {
        setRegistrationData((prev) => ({ ...prev, ...data }));
    };

    const resetRegistrationData = () => {
        setRegistrationData(initialRegistrationData);
    };

    return (
        <RegistrationContext.Provider
            value={{ registrationData, updateRegistrationData, resetRegistrationData }}
        >
            {children}
        </RegistrationContext.Provider>
    );
}

// ─── Hook ───────────────────────────────────────────────────
export function useRegistration() {
    const context = useContext(RegistrationContext);
    if (!context) {
        throw new Error('useRegistration must be used within RegistrationProvider');
    }
    return context;
}
