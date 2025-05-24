import {OfferModel} from "../models/OfferModel.ts";
import api from "../api/axiosApi.ts";
import AddOfferForm from "../components/Offer/Form/AddOfferForm.tsx";
import React, {useEffect, useState} from "react";
import ErrorPage from "./ErrorPage.tsx";
import {useAuth} from "../Auth/useAuth.ts";

const AddOfferPage: React.FC = () => {

    const [error, setError] = useState<string | null>(null);
    const { auth } = useAuth();
    const userRole = auth.user?.role;
    const [checkedAuthFlag, setCheckedAuthFlag] = useState(false);


    useEffect(() => {
        if (!userRole) {
            setError("You must be logged as landlord to add an offer.");
        } else if (userRole !== "landlord") {
            setError("403 – You don't have permission to perform this action."); //TODO POGOARNIAC 403
        } else {
            setError(null);
        }
        setCheckedAuthFlag(true);
    }, [userRole]);

    const handleAddOffer = async (offer: OfferModel) => {
        try {
            await api.post(`/offers/add-offer/`, offer, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
        } catch (error) {
            console.error('Error adding offer:', error);
            setError(error);
        }
    }

    if (!checkedAuthFlag) {
        return null; //TODO SKELETON
    }

    if (error) {
        return <ErrorPage message={error} />;
    }

    return (
        //TODO navigate for offer page
        <AddOfferForm onSubmit={handleAddOffer} />
    );

};


export default AddOfferPage;