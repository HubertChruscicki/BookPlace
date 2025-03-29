import React from 'react';
import {Box} from "@mui/material";
const OfferHeader: React.FC = () => {


  return (
    <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "repeat(2, 1fr)",
      gap: 2,
      width: "100%",
      maxWidth: "1220px",
    }}
    >
        <Box
          sx={{gridArea: "1 / 3 / 2 / 4", bgcolor: "lightblue", p: 2, height: 250}}
        >

        </Box>

        <Box
          sx={{gridArea: "1 / 4 / 2 / 5", bgcolor: "lightblue", p: 2, height: 250, borderTopRightRadius: 15,}}
        >

        </Box>

        <Box
          sx={{gridArea: "2 / 3 / 3 / 4", bgcolor: "lightblue", p: 2, height: 250}}
        >

        </Box>

        <Box
          sx={{gridArea: "2 / 4 / 3 / 5", bgcolor: "lightblue", p: 2, height: 250, borderBottomRightRadius: 15}}
        >

        </Box>

        <Box
          sx={{gridArea: "1 / 1 / 3 / 3", bgcolor: "lightblue", p: 2, borderTopLeftRadius: 15, borderBottomLeftRadius: 15}}
        >

        </Box>

    </Box>


  );
};

export default OfferHeader;
