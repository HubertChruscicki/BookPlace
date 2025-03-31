import React from "react";
import {useFormContext} from "react-hook-form";
import {Box, TextField, Typography} from "@mui/material";
import {colors} from "../../../../theme/colors.ts";
import FormContainer from "../../../Common/FormContainer.tsx";

const StepSummary: React.FC = () => {
    const {register, formState: {errors}} = useFormContext();

    return (
        <Box>

            <FormContainer
                title={"Everything ready\nGood luck renting your place!"}
            >
            </FormContainer>

            {/*<Typography*/}
            {/*    variant="h4"*/}
            {/*    sx={{*/}
            {/*        fontWeight: 700,*/}
            {/*        color: colors.black[900],*/}
            {/*        letterSpacing: '-0.5px',*/}
            {/*        fontSize: '2.5rem',*/}
            {/*        lineHeight: 1.2,*/}
            {/*        padding: "50px 0"*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Everything ready! Good luck in renting your place!*/}
            {/*</Typography>*/}

        </Box>
    );
}

export default StepSummary;
