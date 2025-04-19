import React from 'react';
import {OfferModel} from "../../../models/OfferModel.ts";
import {useForm} from "react-hook-form";
import {FormProvider} from "react-hook-form";
import {Box, Button, Step, StepLabel, Stepper} from "@mui/material";
import StepInfo from './Steps/StepInfo.tsx';
import StepDetails from './Steps/StepDetails.tsx';
import StepImages from "./Steps/StepImages.tsx";
import StepLocation from './Steps/StepLocation.tsx';
import StepSummary from "./Steps/StepSummary.tsx";
import StepType from "./Steps/StepType.tsx";
import StepAmenities from "./Steps/StepAmenities.tsx";

export interface OfferFormProps {
    onSubmit: (offer: OfferModel) => Promise<void>;
}

const AddOfferForm: React.FC<OfferFormProps> = ({onSubmit}) => {

    const [activeStep, setActiveStep] = React.useState(0);
    const methods = useForm<OfferModel>({
        mode: "onSubmit",
        defaultValues: {
            offer_type: null,
            title: "",
            description: "",
            price_per_night: null,
            max_guests: null,
            location: {
                country: "",
                city: "",
                address: "",
                province: "",
                latitude: 0,
                longitude: 0
            },
            details: {
                rooms: null,
                beds: null,
                double_beds: null,
                sofa_beds: null
            },
            amenities: {
                private_bathroom: false,
                kitchen: false,
                wifi: false,
                tv: false,
                fridge_in_room: false,
                air_conditioning: false,
                smoking_allowed: false,
                pets_allowed: false,
                parking: false,
                swimming_pool: false,
                sauna: false,
                jacuzzi: false,
            },
            images: []
        },
      });

    const steps = [
        "Type of place",
        "Basic information",
        "Details",
        "Location",
        "Images",
        "Summary"
    ];

    const handleNext = async () => {
        const fieldsPerStep: string[][] = [
        ["offer_type"],
        ["title", "description", "price_per_night", "max_guests"],
        ["location.city", "location.address", "location.country", "location.province", "location.latitude", "location.longitude"],
        ["details.rooms", "details.beds", "details.double_beds", "details.sofa_beds"],
        ["details.rooms", "details.beds", "details.double_beds", "details.sofa_beds"],
        [
            "amenities.private_bathroom",
            "amenities.kitchen",
            "amenities.wifi",
            "amenities.tv",
            "amenities.fridge_in_room",
            "amenities.air_conditioning",
            "amenities.smoking_allowed",
            "amenities.pets_allowed",
            "amenities.parking",
            "amenities.swimming_pool",
            "amenities.sauna",
            "amenities.jacuzzi"
        ],
        ["images"],
        ];

        if(activeStep >= fieldsPerStep.length){
            setActiveStep(s => s + 1);
            return;
        }

        const isValid = await methods.trigger(fieldsPerStep[activeStep]);
        if(isValid){
            setActiveStep(s => s + 1);
        }
    }

    const handleBack = async () => {
        setActiveStep(s => s - 1);
    }

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFinalSubmit = methods.handleSubmit(async (data) => {

        const files = data.images as unknown as File[];
        const base64Images = await Promise.all(
            files.map(file => convertToBase64(file))
        );

        const formattedImages = base64Images.map((b64, index) => ({
            is_main: index === 0,
            image: b64,
        }));

        const finalData = {
            ...data,
            images: formattedImages,
        };

        console.log("🟢 Data to send (with base64):", finalData);
        await onSubmit(finalData);
    });


    return(
        <FormProvider {...methods}
        >
            <Box my={0}
           >
                {activeStep === 0 && <StepType/>}
                {activeStep === 1 && <StepInfo/>}
                {activeStep === 2 && <StepLocation/>}
                {activeStep === 3 && <StepDetails/>}
                {activeStep === 4 && <StepAmenities/>}
                {activeStep === 5 && <StepImages/>}
                {activeStep === 6 && <StepSummary/>}
            </Box>

            <Box
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    backgroundColor: "white",
                    zIndex: 1000,
                    borderTop: "1px solid #e0e0e0",
                }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label)=>(
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "30px"
                    }}>
                    <Button onClick={handleBack} disabled={activeStep === 0}>Go back</Button>
                    {activeStep === steps.length - 1 ? (
                        <Button variant="contained" onClick={handleFinalSubmit}>Submit</Button>
                    ) : (
                        <Button variant="contained" onClick={handleNext}>Next</Button>
                    )}
                </Box>
            </Box>

        </FormProvider>
    )

};

export default AddOfferForm;


