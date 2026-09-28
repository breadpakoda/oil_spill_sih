// Realistic AIS Marine Traffic across the Indian Ocean, Arabian Sea & Bay of Bengal shipping lanes
export const allMapShips = [
  // Arabian Sea & Mumbai approach lanes
  { id: 'v-101', name: 'MV Ocean Star', type: 'Crude Oil Tanker', flag: 'Panama 🇵🇦', mmsi: '352001842', lat: 18.845, lng: 72.825, sog: 4.2, heading: 142, status: 'Underway Using Engine', destination: 'Jawaharlal Nehru Port', length: 274, dwt: 115000, isSuspect: true },
  { id: 'v-102', name: 'MT Bharat Ratna', type: 'Oil Products Tanker', flag: 'India 🇮🇳', mmsi: '419000124', lat: 18.980, lng: 72.650, sog: 11.4, heading: 195, status: 'Underway', destination: 'Mumbai SPM', length: 245, dwt: 85000 },
  { id: 'v-103', name: 'MSC Alessia', type: 'Container Ship', flag: 'Liberia 🇱🇷', mmsi: '636015234', lat: 18.720, lng: 72.950, sog: 16.8, heading: 320, status: 'Underway', destination: 'Nhava Sheva (JNPT)', length: 334, dwt: 98000 },
  { id: 'v-104', name: 'CMA CGM Mumbai', type: 'Container Ship', flag: 'France 🇫🇷', mmsi: '228034000', lat: 18.620, lng: 72.580, sog: 18.2, heading: 335, status: 'Underway', destination: 'Colombo -> JNPT', length: 366, dwt: 140000 },
  { id: 'v-105', name: 'Sea Commander', type: 'Chemical Tanker', flag: 'Marshall Islands 🇲🇭', mmsi: '538006782', lat: 18.910, lng: 72.710, sog: 9.6, heading: 138, status: 'Underway', destination: 'Kandla -> Singapore', length: 183, dwt: 49000 },
  { id: 'v-106', name: 'Tug Ocean Titan', type: 'Tug / Offshore Support', flag: 'India 🇮🇳', mmsi: '419900451', lat: 18.890, lng: 72.880, sog: 6.8, heading: 75, status: 'Engaged in Towing', destination: 'Mumbai Outer Anchorage', length: 65, dwt: 2400 },
  { id: 'v-107', name: 'Pacific Pioneer', type: 'Bulk Carrier', flag: 'Singapore 🇸🇬', mmsi: '563044000', lat: 19.120, lng: 72.450, sog: 13.1, heading: 160, status: 'Underway', destination: 'Mormugao', length: 225, dwt: 76000 },
  { id: 'v-108', name: 'Ever Golden', type: 'Ultra Large Container', flag: 'Panama 🇵🇦', mmsi: '353009812', lat: 18.450, lng: 72.350, sog: 19.5, heading: 340, status: 'Underway', destination: 'Jebel Ali', length: 400, dwt: 218000 },
  { id: 'v-109', name: 'Al-Jalila', type: 'LNG Carrier', flag: 'Qatar 🇶🇦', mmsi: '466023000', lat: 19.350, lng: 72.150, sog: 17.0, heading: 155, status: 'Underway', destination: 'Dahej LNG Terminal', length: 290, dwt: 122000 },
  { id: 'v-110', name: 'Coastal Fisher 4', type: 'Commercial Fishing', flag: 'India 🇮🇳', mmsi: '419102450', lat: 18.780, lng: 72.740, sog: 3.5, heading: 85, status: 'Fishing', destination: 'Sassoon Docks', length: 32, dwt: 180 },
  { id: 'v-111', name: 'Global Harmony', type: 'LPG Tanker', flag: 'Liberia 🇱🇷', mmsi: '636091234', lat: 18.520, lng: 72.690, sog: 12.3, heading: 330, status: 'Underway', destination: 'Mangalore -> Mumbai', length: 220, dwt: 54000 },
  { id: 'v-112', name: 'Samudra Nidhi', type: 'Research & Survey', flag: 'India 🇮🇳', mmsi: '419088710', lat: 19.050, lng: 72.620, sog: 7.1, heading: 240, status: 'Restricted Manoeuvrability', destination: 'Offshore Survey Zone', length: 98, dwt: 4500 },

  // Gujarat / Gulf of Kutch / Saurashtra Coast
  { id: 'v-113', name: 'MT Gujarat Pioneer', type: 'Crude Oil Tanker', flag: 'India 🇮🇳', mmsi: '419000889', lat: 22.480, lng: 69.750, sog: 8.5, heading: 72, status: 'Underway', destination: 'Vadinar SPM', length: 330, dwt: 300000 },
  { id: 'v-114', name: 'Sikka Energy', type: 'Very Large Crude Carrier', flag: 'Panama 🇵🇦', mmsi: '354001221', lat: 22.560, lng: 69.450, sog: 10.2, heading: 90, status: 'Moored to SPM', destination: 'Reliance Sikka Port', length: 333, dwt: 310000 },
  { id: 'v-115', name: 'Mundra Express', type: 'Container Ship', flag: 'Hong Kong 🇭🇰', mmsi: '477001420', lat: 22.650, lng: 69.600, sog: 14.8, heading: 280, status: 'Underway', destination: 'Mundra Port', length: 300, dwt: 88000 },
  { id: 'v-116', name: 'Indus Trader', type: 'Bulk Carrier', flag: 'India 🇮🇳', mmsi: '419000331', lat: 21.850, lng: 69.250, sog: 12.0, heading: 140, status: 'Underway', destination: 'Kandla -> Pipavav', length: 190, dwt: 55000 },
  { id: 'v-117', name: 'Arabian Falcon', type: 'General Cargo', flag: 'UAE 🇦🇪', mmsi: '470002110', lat: 22.120, lng: 68.900, sog: 11.0, heading: 115, status: 'Underway', destination: 'Okha Anchorage', length: 140, dwt: 18000 },

  // South-West Coast (Goa, Mangalore, Kochi approach)
  { id: 'v-118', name: 'Mormugao Miner', type: 'Iron Ore Carrier', flag: 'India 🇮🇳', mmsi: '419000552', lat: 15.420, lng: 73.650, sog: 9.8, heading: 260, status: 'Underway', destination: 'Mormugao Port', length: 229, dwt: 82000 },
  { id: 'v-119', name: 'Kochi Star', type: 'Crude Oil Tanker', flag: 'Bahamas 🇧🇸', mmsi: '311000451', lat: 9.950, lng: 76.120, sog: 10.5, heading: 80, status: 'Underway', destination: 'Kochi SPM Refinery', length: 250, dwt: 105000 },
  { id: 'v-120', name: 'Kerala Rani', type: 'Passenger / Ro-Ro', flag: 'India 🇮🇳', mmsi: '419000789', lat: 9.820, lng: 76.220, sog: 14.2, heading: 350, status: 'Underway', destination: 'Kochi -> Lakshadweep', length: 120, dwt: 6500 },
  { id: 'v-121', name: 'Southern Knight', type: 'Container Ship', flag: 'Singapore 🇸🇬', mmsi: '563009988', lat: 8.500, lng: 76.850, sog: 18.0, heading: 125, status: 'Underway', destination: 'Vizhinjam Transshipment', length: 396, dwt: 195000 },

  // East Coast & Bay of Bengal (Chennai, Vizag, Paradip, Kolkata)
  { id: 'v-122', name: 'MT Silver Ray', type: 'Chemical / Oil Tanker', flag: 'Malta 🇲🇹', mmsi: '229000314', lat: 13.180, lng: 80.420, sog: 7.8, heading: 22, status: 'Underway', destination: 'Chennai Outer Anchorage', length: 182, dwt: 46000 },
  { id: 'v-123', name: 'Coromandel Pearl', type: 'Bulk Carrier', flag: 'India 🇮🇳', mmsi: '419000674', lat: 13.080, lng: 80.320, sog: 0.2, heading: 90, status: 'At Anchor', destination: 'Chennai Port', length: 225, dwt: 75000 },
  { id: 'v-124', name: 'Bay Navigator', type: 'Container Ship', flag: 'Panama 🇵🇦', mmsi: '355001990', lat: 13.350, lng: 80.580, sog: 15.4, heading: 190, status: 'Underway', destination: 'Kattupalli -> Colombo', length: 280, dwt: 68000 },
  { id: 'v-125', name: 'Vizag Steel Express', type: 'Capesize Bulk Carrier', flag: 'India 🇮🇳', mmsi: '419000912', lat: 17.650, lng: 83.350, sog: 11.2, heading: 215, status: 'Underway', destination: 'Visakhapatnam Port', length: 292, dwt: 180000 },
  { id: 'v-126', name: 'Paradip Coal Pioneer', type: 'Bulk Carrier', flag: 'Liberia 🇱🇷', mmsi: '636001889', lat: 20.250, lng: 86.720, sog: 10.0, heading: 310, status: 'Underway', destination: 'Paradip Port', length: 230, dwt: 85000 },
  { id: 'v-127', name: 'Haldia Trader', type: 'General Cargo', flag: 'Bangladesh 🇧🇩', mmsi: '405000123', lat: 21.800, lng: 88.050, sog: 8.4, heading: 15, status: 'Underway', destination: 'Haldia Dock Complex', length: 135, dwt: 14000 },

  // Trans-Indian Ocean International Sea Lanes (Deep Sea)
  { id: 'v-128', name: 'Cosco Shipping Galaxy', type: 'Container Ship', flag: 'Hong Kong 🇭🇰', mmsi: '477009812', lat: 16.500, lng: 70.200, sog: 20.1, heading: 118, status: 'Underway', destination: 'Suez -> Singapore', length: 400, dwt: 215000 },
  { id: 'v-129', name: 'Front Endurance', type: 'VLCC Supertanker', flag: 'Marshall Islands 🇲🇭', mmsi: '538009110', lat: 15.200, lng: 68.800, sog: 14.5, heading: 112, status: 'Underway', destination: 'Ras Tanura -> China', length: 336, dwt: 308000 },
  { id: 'v-130', name: 'MT Southern Voyager', type: 'Product Tanker', flag: 'Liberia 🇱🇷', mmsi: '636019882', lat: 6.950, lng: 93.850, sog: 13.8, heading: 115, status: 'Underway', destination: 'Malacca Strait Approach', length: 228, dwt: 74000 },
  { id: 'v-131', name: 'Stolt Sunrise', type: 'Chemical Parcel Tanker', flag: 'Cayman Islands 🇰🇾', mmsi: '319001450', lat: 7.400, lng: 92.900, sog: 14.0, heading: 295, status: 'Underway', destination: 'Singapore -> Mumbai', length: 185, dwt: 44000 },
  { id: 'v-132', name: 'Nordic Barents', type: 'Bulk Carrier', flag: 'Norway 🇳🇴', mmsi: '257001920', lat: 10.500, lng: 85.200, sog: 12.8, heading: 60, status: 'Underway', destination: 'Port Hedland -> Dhamra', length: 255, dwt: 110000 },
  { id: 'v-133', name: 'Andaman Express', type: 'Passenger / Cargo Ferry', flag: 'India 🇮🇳', mmsi: '419000499', lat: 11.650, lng: 92.750, sog: 15.0, heading: 20, status: 'Underway', destination: 'Port Blair -> Chennai', length: 145, dwt: 8500 }
];
