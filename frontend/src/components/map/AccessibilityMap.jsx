import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix default icon issue in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AccessibilityMap = ({ places: propPlaces, loading: propLoading }) => {
  const [places, setPlaces] = useState(propPlaces || []);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(propLoading ?? false);

  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  });

  useEffect(() => {
    // Use props if available
    if (Array.isArray(propPlaces) && propPlaces.length) {
      setPlaces(propPlaces);
      setLoading(!!propLoading);
    } else {
      // Fetch places from backend
      const apiBase =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      setLoading(true);
      axios
        .get(`${apiBase}/places`)
        .then((res) => {
          const payload = res.data;
          const p = Array.isArray(payload) ? payload : payload.places || [];
          setPlaces(p);
        })
        .catch((err) => console.error("Error loading places", err))
        .finally(() => setLoading(false));
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation([20.5937, 78.9629]), // fallback India center
        { timeout: 5000 }
      );
    } else {
      setUserLocation([20.5937, 78.9629]);
    }
  }, [propPlaces, propLoading]);

  return (
    <div className="w-full h-[500px] rounded-xl shadow-lg overflow-hidden">
      {userLocation ? (
        <MapContainer center={userLocation} zoom={14} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Marker */}
          <Marker position={userLocation} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Accessible places */}
          {places.map((place) => {
            const coords =
              place.location?.coordinates || place.coordinates || [];
            const lat = coords[1];
            const lng = coords[0];
            if (typeof lat !== "number" || typeof lng !== "number") return null;
            return (
              <Marker key={place._id} position={[lat, lng]}>
                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  {place.address || place.description}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        <p className="text-center p-4">Fetching your location...</p>
      )}

      {loading && (
        <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-sm font-medium">Loading places...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMap;
