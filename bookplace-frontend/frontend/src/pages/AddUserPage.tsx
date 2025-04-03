import {Box, Typography} from "@mui/material";
import {OfferModel} from "../models/OfferModel.ts";
import api from "../api/axiosApi.ts";
import AddOfferForm from "../components/Offer/Form/AddOfferForm.tsx";

const AddUserPage: React.FC = () => {

    const handleAddUser = async (offer: UserModel) => {
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
        <AddUserForm onSubmit={handleAddUser}/>
    );
};


export default AddUserPage;