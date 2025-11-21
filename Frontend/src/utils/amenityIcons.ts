import WifiIcon from '@mui/icons-material/Wifi';
import TvIcon from '@mui/icons-material/Tv';
import HotTubIcon from '@mui/icons-material/HotTub';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PoolIcon from '@mui/icons-material/Pool';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import AirIcon from '@mui/icons-material/Air';
import BathtubIcon from '@mui/icons-material/Bathtub';
import ShowerIcon from '@mui/icons-material/Shower';
import BalconyIcon from '@mui/icons-material/Balcony';
import DeckIcon from '@mui/icons-material/Deck';
import GrassIcon from '@mui/icons-material/Grass';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import SpaIcon from '@mui/icons-material/Spa';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import KayakingIcon from '@mui/icons-material/Kayaking';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';
import LockIcon from '@mui/icons-material/Lock';
import IronIcon from '@mui/icons-material/Iron';
import WavesIcon from '@mui/icons-material/Waves';
import TerrainIcon from '@mui/icons-material/Terrain';
import WaterIcon from '@mui/icons-material/Water';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import type {SvgIconComponent} from '@mui/icons-material';

const iconFallback = WifiIcon;

export const AMENITY_ICON_MAP: Record<number, SvgIconComponent> = {
    1: WifiIcon,
    2: TvIcon,
    3: HotTubIcon,
    4: AcUnitIcon,
    5: PoolIcon,
    6: LocalParkingIcon,
    7: KitchenIcon,
    8: LocalLaundryServiceIcon,
    9: LocalLaundryServiceIcon,
    10: AirIcon,
    11: BathtubIcon,
    12: ShowerIcon,
    13: BalconyIcon,
    14: DeckIcon,
    15: GrassIcon,
    16: DeckIcon,
    17: GrassIcon,
    18: OutdoorGrillIcon,
    19: FireplaceIcon,
    20: SpaIcon,
    21: FitnessCenterIcon,
    22: SportsEsportsIcon,
    23: SportsEsportsIcon,
    24: SportsEsportsIcon,
    25: SportsEsportsIcon,
    26: TvIcon,
    27: TvIcon,
    28: ChildFriendlyIcon,
    29: ChildFriendlyIcon,
    30: ChildFriendlyIcon,
    31: ChildFriendlyIcon,
    32: TwoWheelerIcon,
    33: KayakingIcon,
    34: SportsEsportsIcon,
    35: KitchenIcon,
    36: KitchenIcon,
    37: LocalCafeIcon,
    38: SafetyDividerIcon,
    39: LockIcon,
    40: IronIcon,
    41: WavesIcon,
    42: TerrainIcon,
    43: WaterIcon,
    44: BeachAccessIcon,
    45: LocationCityIcon,
    46: DirectionsTransitIcon,
};

export const getAmenityIcon = (id: number): SvgIconComponent => AMENITY_ICON_MAP[id] || iconFallback;
