import ApartmentIcon from '@mui/icons-material/Apartment';
import HouseIcon from '@mui/icons-material/House';
import VillaIcon from '@mui/icons-material/Villa';
import CabinIcon from '@mui/icons-material/Cabin';
import HotelIcon from '@mui/icons-material/Hotel';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import BusinessIcon from '@mui/icons-material/Business';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CottageIcon from '@mui/icons-material/Cottage';
import CastleIcon from '@mui/icons-material/Castle';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import FoundationIcon from '@mui/icons-material/Foundation';
import BungalowIcon from '@mui/icons-material/Bungalow';
import PoolIcon from '@mui/icons-material/Pool';
import ForestIcon from '@mui/icons-material/Forest';
import WaterIcon from '@mui/icons-material/Water';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import TerrainIcon from '@mui/icons-material/Terrain';
import SailingIcon from '@mui/icons-material/Sailing';
import CampaignIcon from '@mui/icons-material/Campaign';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ParkIcon from '@mui/icons-material/Park';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import type { SvgIconComponent } from '@mui/icons-material';

const iconFallback = HouseIcon;

/**
 * Icon mapping for offer types based on actual API response
 * Maps offer type IDs to MUI icons
 */
export const OFFER_TYPE_ICON_MAP: Record<number, SvgIconComponent> = {
    1: ApartmentIcon,       // Apartment
    2: VillaIcon,           // Villa
    3: HouseIcon,           // House
    4: BedroomParentIcon,   // Room
    5: BusinessIcon,        // Penthouse
    6: CastleIcon,          // Manor
    7: PoolIcon,            // House with Pool
    8: ForestIcon,          // Forest House
    9: WaterIcon,           // Lakeside House
    10: BeachAccessIcon,    // Seaside House
    11: TerrainIcon,        // Mountain House
    12: WaterIcon,          // Riverside House
    13: HotelIcon,          // Hotel
    14: NightShelterIcon,   // Hostel
    15: HotelIcon,          // Resort
    16: CabinIcon,          // Camping Cabin
    17: DirectionsCarIcon,  // Camping Trailer
    18: SailingIcon,        // Yacht
    19: CampaignIcon,       // Tent
    20: WbSunnyIcon,        // Summer House
    21: BungalowIcon,       // Bungalow
    22: BeachAccessIcon,    // Beach Hut
    23: HomeWorkIcon,       // Mill
    24: CastleIcon,         // Castle
    25: FoundationIcon,     // Tower
    26: ParkIcon,           // Treehouse
    27: AcUnitIcon,         // Igloo
};

/**
 * Get the icon component for an offer type
 * @param id - The offer type ID
 * @returns The corresponding MUI icon component
 */
export const getOfferTypeIcon = (id: number): SvgIconComponent => {
    return OFFER_TYPE_ICON_MAP[id] || iconFallback;
};

/**
 * Get icon by offer type name (fallback method)
 */
export const getOfferTypeIconByName = (name: string): SvgIconComponent => {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('apartment')) return ApartmentIcon;
    if (nameLower.includes('villa')) return VillaIcon;
    if (nameLower.includes('house') && nameLower.includes('pool')) return PoolIcon;
    if (nameLower.includes('forest')) return ForestIcon;
    if (nameLower.includes('lake')) return WaterIcon;
    if (nameLower.includes('sea')) return BeachAccessIcon;
    if (nameLower.includes('beach')) return BeachAccessIcon;
    if (nameLower.includes('mountain')) return TerrainIcon;
    if (nameLower.includes('river')) return WaterIcon;
    if (nameLower.includes('house')) return HouseIcon;
    if (nameLower.includes('room')) return BedroomParentIcon;
    if (nameLower.includes('penthouse')) return BusinessIcon;
    if (nameLower.includes('manor')) return CastleIcon;
    if (nameLower.includes('hotel')) return HotelIcon;
    if (nameLower.includes('hostel')) return NightShelterIcon;
    if (nameLower.includes('resort')) return HotelIcon;
    if (nameLower.includes('cabin')) return CabinIcon;
    if (nameLower.includes('trailer')) return DirectionsCarIcon;
    if (nameLower.includes('yacht')) return SailingIcon;
    if (nameLower.includes('tent')) return CampaignIcon;
    if (nameLower.includes('summer')) return WbSunnyIcon;
    if (nameLower.includes('bungalow')) return BungalowIcon;
    if (nameLower.includes('hut')) return CottageIcon;
    if (nameLower.includes('mill')) return HomeWorkIcon;
    if (nameLower.includes('castle')) return CastleIcon;
    if (nameLower.includes('tower')) return FoundationIcon;
    if (nameLower.includes('tree')) return ParkIcon;
    if (nameLower.includes('igloo')) return AcUnitIcon;
    
    return iconFallback;
};
