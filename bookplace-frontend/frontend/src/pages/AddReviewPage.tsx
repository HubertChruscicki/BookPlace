import api from "../api/axiosApi.ts";
import AddReviewForm from "../components/Reviews/AddReviewForm.tsx";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {ReviewModel} from "../models/ReviewModel.ts";

const AddReviewPage: React.FC = () => {
    const offer_id: number = Number(useLocation().pathname.split("/")[2]);

    const handleAddReview = async (review: ReviewModel) => {
        try {
            await api.post(`/reviews/add-review/${offer_id}/`, review, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
        } catch (error) {
            console.error('Error adding review:', error);
        }
    }


    useEffect(() => {
        console.log(offer_id)
    },[offer_id]);

    return(
        <AddReviewForm onSubmit={handleAddReview}/>
    );
};


export default AddReviewPage;