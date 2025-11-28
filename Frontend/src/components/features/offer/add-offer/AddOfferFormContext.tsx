import React, { createContext, useContext, type ReactNode } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import type { CreateOfferPhotoPayload } from '../../../../models/OfferModels';

// Form data interface matching the final payload structure
export interface AddOfferFormData {
    // Step 1: Offer Type
    offerTypeId: number;
    
    // Step 2: Basic Details
    title: string;
    description: string;
    pricePerNight: number;
    maxGuests: number;
    rooms: number;
    singleBeds: number;
    doubleBeds: number;
    sofas: number;
    bathrooms: number;
    
    // Step 3: Amenities
    amenityIds: number[];
    
    // Step 4: Location
    addressStreet: string;
    addressCity: string;
    addressZipCode: string;
    addressCountry: string;
    addressLatitude: number;
    addressLongitude: number;
    
    // Step 5: Photos
    photos: CreateOfferPhotoPayload[];
}

// Default form values
export const defaultFormValues: AddOfferFormData = {
    offerTypeId: -1, // -1 means not selected
    title: '',
    description: '',
    pricePerNight: 0,
    maxGuests: 1,
    rooms: 1,
    singleBeds: 0,
    doubleBeds: 1,
    sofas: 0,
    bathrooms: 1,
    amenityIds: [],
    addressStreet: '',
    addressCity: '',
    addressZipCode: '',
    addressCountry: '',
    addressLatitude: 52.2297, // Default Warsaw coordinates
    addressLongitude: 21.0122,
    photos: [],
};

// Context type
type AddOfferFormContextType = UseFormReturn<AddOfferFormData>;

const AddOfferFormContext = createContext<AddOfferFormContextType | null>(null);

// Provider component
interface AddOfferFormProviderProps {
    children: ReactNode;
}

export const AddOfferFormProvider: React.FC<AddOfferFormProviderProps> = ({ children }) => {
    const methods = useForm<AddOfferFormData>({
        defaultValues: defaultFormValues,
        mode: 'onChange',
    });

    return (
        <AddOfferFormContext.Provider value={methods}>
            {children}
        </AddOfferFormContext.Provider>
    );
};

// Hook to access form context
export const useAddOfferForm = (): UseFormReturn<AddOfferFormData> => {
    const context = useContext(AddOfferFormContext);
    if (!context) {
        throw new Error('useAddOfferForm must be used within AddOfferFormProvider');
    }
    return context;
};
