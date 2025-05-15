import {OfferModel} from "../../models/OfferModel.ts";
import {createContext, useContext, useEffect, useState} from "react";
import api from "../../api/axiosApi.ts";
import {useLocation} from "react-router-dom";

interface OfferContextType {
    offer: OfferModel | null;
    isLoading: boolean;
    error: string | null;
}

const OfferContext = createContext<OfferContextType>({
    offer: null,
    isLoading: false,
    error: null,
});

export const useOffer = () => useContext(OfferContext);

export const OfferProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [offer, setOffer] = useState<OfferModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const id: number = Number(useLocation().pathname.split("/")[2]);

    useEffect(() => {
        setIsLoading(true);
        api.get(`/offers/${id}`)
            .then(res => {
                setOffer(res.data);
                setError(null);
            })
            .catch(err => {
                console.error("Error during loading offer data:", err)
                setError("Cannot find offer");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    return (

        <OfferContext.Provider value={{offer, isLoading, error}}>
            {children}
        </OfferContext.Provider>
    )
}

