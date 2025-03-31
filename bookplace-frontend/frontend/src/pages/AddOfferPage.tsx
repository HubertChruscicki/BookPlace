import {Box, Typography} from "@mui/material";
import {OfferModel} from "../models/OfferModel.ts";
import api from "../api/axiosApi.ts";
import AddOfferForm from "../components/Offer/Form/AddOfferForm.tsx";

const AddOfferPage: React.FC = () => {

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
        }
    }


    return(
        <AddOfferForm onSubmit={handleAddOffer}/>
    );
};


export default AddOfferPage;