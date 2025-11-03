// Major US cities with their coordinates for event spaces
const usCities = [
  // Major Metropolitan Areas
  { value: "nyc", label: "New York City", state: "New York", latlng: [40.7128, -74.0060] },
  { value: "la", label: "Los Angeles", state: "California", latlng: [34.0522, -118.2437] },
  { value: "chicago", label: "Chicago", state: "Illinois", latlng: [41.8781, -87.6298] },
  { value: "houston", label: "Houston", state: "Texas", latlng: [29.7604, -95.3698] },
  { value: "phoenix", label: "Phoenix", state: "Arizona", latlng: [33.4484, -112.0740] },
  { value: "philadelphia", label: "Philadelphia", state: "Pennsylvania", latlng: [39.9526, -75.1652] },
  { value: "san-antonio", label: "San Antonio", state: "Texas", latlng: [29.4241, -98.4936] },
  { value: "san-diego", label: "San Diego", state: "California", latlng: [32.7157, -117.1611] },
  { value: "dallas", label: "Dallas", state: "Texas", latlng: [32.7767, -96.7970] },
  { value: "austin", label: "Austin", state: "Texas", latlng: [30.2672, -97.7431] },
  
  // West Coast
  { value: "san-jose", label: "San Jose", state: "California", latlng: [37.3382, -121.8863] },
  { value: "san-francisco", label: "San Francisco", state: "California", latlng: [37.7749, -122.4194] },
  { value: "seattle", label: "Seattle", state: "Washington", latlng: [47.6062, -122.3321] },
  { value: "portland", label: "Portland", state: "Oregon", latlng: [45.5152, -122.6784] },
  { value: "sacramento", label: "Sacramento", state: "California", latlng: [38.5816, -121.4944] },
  { value: "oakland", label: "Oakland", state: "California", latlng: [37.8044, -122.2712] },
  
  // East Coast
  { value: "boston", label: "Boston", state: "Massachusetts", latlng: [42.3601, -71.0589] },
  { value: "washington-dc", label: "Washington, D.C.", state: "District of Columbia", latlng: [38.9072, -77.0369] },
  { value: "baltimore", label: "Baltimore", state: "Maryland", latlng: [39.2904, -76.6122] },
  { value: "atlanta", label: "Atlanta", state: "Georgia", latlng: [33.7490, -84.3880] },
  { value: "miami", label: "Miami", state: "Florida", latlng: [25.7617, -80.1918] },
  { value: "tampa", label: "Tampa", state: "Florida", latlng: [27.9506, -82.4572] },
  { value: "orlando", label: "Orlando", state: "Florida", latlng: [28.5383, -81.3792] },
  { value: "charlotte", label: "Charlotte", state: "North Carolina", latlng: [35.2271, -80.8431] },
  { value: "raleigh", label: "Raleigh", state: "North Carolina", latlng: [35.7796, -78.6382] },
  
  // Midwest
  { value: "detroit", label: "Detroit", state: "Michigan", latlng: [42.3314, -83.0458] },
  { value: "indianapolis", label: "Indianapolis", state: "Indiana", latlng: [39.7684, -86.1581] },
  { value: "columbus", label: "Columbus", state: "Ohio", latlng: [39.9612, -82.9988] },
  { value: "milwaukee", label: "Milwaukee", state: "Wisconsin", latlng: [43.0389, -87.9065] },
  { value: "minneapolis", label: "Minneapolis", state: "Minnesota", latlng: [44.9778, -93.2650] },
  { value: "kansas-city", label: "Kansas City", state: "Missouri", latlng: [39.0997, -94.5786] },
  { value: "st-louis", label: "St. Louis", state: "Missouri", latlng: [38.6270, -90.1994] },
  
  // South
  { value: "nashville", label: "Nashville", state: "Tennessee", latlng: [36.1627, -86.7816] },
  { value: "memphis", label: "Memphis", state: "Tennessee", latlng: [35.1495, -90.0490] },
  { value: "new-orleans", label: "New Orleans", state: "Louisiana", latlng: [29.9511, -90.0715] },
  { value: "jacksonville", label: "Jacksonville", state: "Florida", latlng: [30.3322, -81.6557] },
  { value: "fort-worth", label: "Fort Worth", state: "Texas", latlng: [32.7555, -97.3308] },
  { value: "el-paso", label: "El Paso", state: "Texas", latlng: [31.7619, -106.4850] },
  
  // Mountain & Southwest
  { value: "denver", label: "Denver", state: "Colorado", latlng: [39.7392, -104.9903] },
  { value: "las-vegas", label: "Las Vegas", state: "Nevada", latlng: [36.1699, -115.1398] },
  { value: "albuquerque", label: "Albuquerque", state: "New Mexico", latlng: [35.0844, -106.6504] },
  { value: "tucson", label: "Tucson", state: "Arizona", latlng: [32.2226, -110.9747] },
  { value: "salt-lake-city", label: "Salt Lake City", state: "Utah", latlng: [40.7608, -111.8910] },
];

const formattedCities = usCities.map((city) => ({
  value: city.value,
  label: city.label,
  state: city.state,
  latlng: city.latlng,
  region: city.state, // For compatibility with existing code
}));

const useCities = () => {
  const getAll = () => formattedCities;

  const getByValue = (value: string) => {
    return formattedCities.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useCities;
