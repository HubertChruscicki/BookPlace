import {OfferModel} from "../models/OfferModel.ts";
import api from "../api/axiosApi.ts";
import AddOfferForm from "../components/Offer/Form/AddOfferForm.tsx";
import {useEffect, useState} from "react";
import ErrorPage from "./ErrorPage.tsx";
import {useAuth} from "../Auth/useAuth.ts";

const AddOfferPage: React.FC = () => {

    const [error, setError] = useState<string | null>(null);
    const { auth } = useAuth();
    const userRole = auth.user?.role;

    useEffect(() => {
        if (!userRole) {
            setError("You must be logged as landlord to add an offer.");
        } else if (userRole !== "landlord") {
            setError("403 – You don't have permission to perform this action.");
        } else {
            setError(null);
        }
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


    return error
        ? <ErrorPage message={error} />
        : <AddOfferForm onSubmit={handleAddOffer} />;

};


export default AddOfferPage;