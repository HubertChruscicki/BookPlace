import {Box, Typography} from "@mui/material";
import Header from "../components/Header/Header.tsx";

const MainPage: React.FC = () => {


  return(

      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: "0px 40px"}}>
          <Header fullWidth={true}/> //TODO STICKY
          <Typography>Here will be main page</Typography>
      </Box>
  );
};


export default MainPage;