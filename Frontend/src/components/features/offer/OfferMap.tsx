import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, type SxProps, type Theme } from "@mui/material";
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface OfferMapProps {
    lat: number;
    lng: number;
    address: string;
    sx?: SxProps<Theme>;
}

const OfferMap: React.FC<OfferMapProps> = ({ lat, lng, address, sx }) => {
    return (
        <Box sx={{ height: 400, width: '100%', borderRadius: 4, overflow: 'hidden', ...sx }}>
            <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        {address}
                    </Popup>
                </Marker>
            </MapContainer>
        </Box>
    );
};

export default OfferMap;