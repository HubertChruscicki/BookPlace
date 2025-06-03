import BathtubIcon from '@mui/icons-material/Bathtub';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WifiIcon from '@mui/icons-material/Wifi';
import TvIcon from '@mui/icons-material/Tv';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import PetsIcon from '@mui/icons-material/Pets';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import HotTubIcon from '@mui/icons-material/HotTub';
import SpaIcon from '@mui/icons-material/Spa';

const amenityIcons: Record<string, React.ReactNode> = {
    private_bathroom: <BathtubIcon />,
    kitchen: <KitchenIcon />,
    wifi: <WifiIcon />,
    tv: <TvIcon />,
    fridge_in_room: <KitchenOutlinedIcon />,
    air_conditioning: <AcUnitIcon />,
    smoking_allowed: <SmokingRoomsIcon />,
    pets_allowed: <PetsIcon />,
    parking: <LocalParkingIcon />,
    swimming_pool: <PoolIcon />,
    sauna: <SpaIcon />,
    jacuzzi: <HotTubIcon />
};

export default amenityIcons;
