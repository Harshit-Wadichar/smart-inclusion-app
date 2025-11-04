import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { placesAPI } from '../services/api'
import styles from '../styles/AccessibilityMap.module.css'

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AccessibilityMapPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedLocationType, setSelectedLocationType] = useState('')
  const [newPlace, setNewPlace] = useState({ name: '', description: '', type: '' })
  const [allPlaces, setAllPlaces] = useState([])
  const [locationError, setLocationError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Normalize place data from API to consistent format
  const normalizePlaceData = (place) => {
    console.log('Normalizing place:', place)
    
    // Handle different location formats
    let lat, lng;
    
    if (place.location && place.location.coordinates) {
      // GeoJSON format: [longitude, latitude]
      [lng, lat] = place.location.coordinates;
    } else if (place.lat && place.lng) {
      // Direct lat/lng format
      lat = place.lat;
      lng = place.lng;
    } else if (place.latitude && place.longitude) {
      // Alternative naming
      lat = place.latitude;
      lng = place.longitude;
    } else {
      console.warn('Invalid location data:', place)
      return null;
    }
    
    // Convert to numbers if they're strings
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      console.warn('Invalid coordinates:', lat, lng)
      return null;
    }
    
    return {
      id: place._id || place.id,
      name: place.name || 'Unnamed Facility',
      description: place.description || '',
      type: place.type || 'ramp', // Default type
      lat: lat,
      lng: lng,
      verified: place.verified || false,
      tags: place.tags || [],
      photos: place.photos || []
    };
  };

  // Fetch existing places
  const fetchPlaces = async () => {
    try {
      console.log('Fetching places from API...')
      const res = await placesAPI.getAll()
      console.log('Raw API Response:', res.data)
      
      // Normalize all places
      const normalizedPlaces = res.data
        .map(normalizePlaceData)
        .filter(place => place !== null) // Remove invalid places
      
      console.log('Normalized places:', normalizedPlaces)
      setAllPlaces(normalizedPlaces)
    } catch (error) {
      console.error('Error fetching places:', error)
      alert('Error loading existing facilities')
    }
  }

  // Load places on component mount
  useEffect(() => {
    fetchPlaces()
  }, [])

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            console.log('User location found:', location)
            setCurrentLocation(location)
            setLocationError(null)
          },
          (error) => {
            console.error('Geolocation error:', error)
            setLocationError('Unable to get your location. Using default location.')
            setCurrentLocation({ lat: 28.6139, lng: 77.2090 })
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        )
      } else {
        setLocationError('Geolocation is not supported by your browser.')
        setCurrentLocation({ lat: 28.6139, lng: 77.2090 })
      }
    }

    getCurrentLocation()
  }, [])

  // Map click handler
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const location = { lat: e.latlng.lat, lng: e.latlng.lng }
        console.log('Map clicked at:', location)
        setSelectedLocation(location)
        if (!selectedLocationType && newPlace.type) {
          setSelectedLocationType(newPlace.type)
        }
      }
    })
    return null
  }

  // Component to set map view to user location
  const LocationHandler = () => {
    const map = useMap()
    
    useEffect(() => {
      if (currentLocation) {
        map.setView([currentLocation.lat, currentLocation.lng], 13)
      }
    }, [currentLocation, map])
    
    return null
  }

  // Icons - with fallbacks
  const getIcon = (type) => {
    const iconUrls = {
      ramp: '/icons/disabled.png',
      elevator: '/icons/elevator.png',
      braille: '/icons/braille.png',
      default: '/icons/default.png'
    }

    const iconUrl = iconUrls[type] || iconUrls.default
    
    return L.icon({ 
      iconUrl, 
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  }

  const userIcon = L.icon({
    iconUrl: '/icons/user.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  // Handle form submit - FIXED: Send tags as empty string instead of empty array
  const handleAddPlace = async (e) => {
    e.preventDefault()
    if (!selectedLocation) {
      alert('Please select location on the map!')
      return
    }
    if (!newPlace.type) {
      alert('Please select facility type!')
      return
    }
    if (!newPlace.name.trim()) {
      alert('Please enter a facility name!')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare payload - send tags as empty string instead of empty array
      const payload = {
        name: newPlace.name,
        description: newPlace.description,
        type: newPlace.type,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        tags: '', // Send empty string instead of empty array
        photos: [], // Keep photos as empty array
        verified: false
      }
      
      console.log('Adding place payload:', payload)
      
      // Add the new place
      const response = await placesAPI.create(payload)
      console.log('Add place response:', response)
      
      alert('Place added successfully!')
      
      // Normalize the new place and add to state
      const newPlaceNormalized = normalizePlaceData(response.data)
      if (newPlaceNormalized) {
        setAllPlaces(prevPlaces => [...prevPlaces, newPlaceNormalized])
      }
      
      // Also refresh from server to ensure data consistency
      await fetchPlaces()
      
      // Reset form but keep the selected location for visual feedback
      setNewPlace({ name: '', description: '', type: '' })
      
    } catch (error) {
      console.error('Error adding place:', error)
      alert('Error adding place: ' + (error.response?.data?.msg || error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Alternative: Try without tags and photos fields at all
  const handleAddPlaceAlternative = async (e) => {
    e.preventDefault()
    if (!selectedLocation) {
      alert('Please select location on the map!')
      return
    }
    if (!newPlace.type) {
      alert('Please select facility type!')
      return
    }
    if (!newPlace.name.trim()) {
      alert('Please enter a facility name!')
      return
    }

    setIsSubmitting(true)

    try {
      // Try minimal payload with only required fields
      const payload = {
        name: newPlace.name,
        description: newPlace.description,
        type: newPlace.type,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
        // Omit tags and photos completely
      }
      
      console.log('Adding place payload (minimal):', payload)
      
      // Add the new place
      const response = await placesAPI.create(payload)
      console.log('Add place response:', response)
      
      alert('Place added successfully!')
      
      // Normalize the new place and add to state
      const newPlaceNormalized = normalizePlaceData(response.data)
      if (newPlaceNormalized) {
        setAllPlaces(prevPlaces => [...prevPlaces, newPlaceNormalized])
      }
      
      // Also refresh from server to ensure data consistency
      await fetchPlaces()
      
      // Reset form but keep the selected location for visual feedback
      setNewPlace({ name: '', description: '', type: '' })
      
    } catch (error) {
      console.error('Error adding place:', error)
      alert('Error adding place: ' + (error.response?.data?.msg || error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle type change
  const handleTypeChange = (type) => {
    setNewPlace({ ...newPlace, type })
    setSelectedLocationType(type)
  }

  // Clear selected location
  const handleClearSelection = () => {
    setSelectedLocation(null)
    setSelectedLocationType('')
  }

  // Reset form completely
  const handleResetForm = () => {
    setNewPlace({ name: '', description: '', type: '' })
    setSelectedLocation(null)
    setSelectedLocationType('')
  }

  // Safe map center
  const mapCenter = currentLocation?.lat && currentLocation?.lng
    ? [currentLocation.lat, currentLocation.lng]
    : [28.6139, 77.2090]

  console.log('Current state:', {
    currentLocation,
    selectedLocation,
    allPlacesCount: allPlaces.length,
    allPlaces: allPlaces,
    mapCenter
  })

  return (
    <div className={styles['map-page']}>
      <div className={styles.container}>
        <div className={styles['page-header']}>
          <h1>Accessibility Map</h1>
          <p>Admin: Add PWD facilities by filling form and selecting location on map.</p>
          {locationError && (
            <div className={styles.error} style={{color: 'red', fontSize: '14px'}}>
              {locationError}
            </div>
          )}
        </div>

        <div className={styles['map-grid']}>
          {/* Sidebar */}
          <div className={styles['sidebar']}>
            <h3>Add Accessible Place</h3>
            <form onSubmit={handleAddPlaceAlternative} className={styles.form}>
              <div>
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={newPlace.name}
                  onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  className={styles['input-field']}
                  placeholder="Enter facility name"
                />
              </div>

              <div>
                <label>Description</label>
                <textarea
                  rows="3"
                  value={newPlace.description}
                  onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                  className={styles['input-field']}
                  placeholder="Describe the facility"
                />
              </div>

              <div>
                <label>Type *</label>
                <select
                  required
                  value={newPlace.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className={styles['input-field']}
                >
                  <option value="">Select Type</option>
                  <option value="ramp">Ramp</option>
                  <option value="elevator">Elevator</option>
                  <option value="braille">Braille</option>
                </select>
              </div>

              <div className={styles['form-buttons']}>
                <button 
                  type="submit" 
                  className={styles['btn-primary']}
                  disabled={!selectedLocation || !newPlace.type || !newPlace.name.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Place'}
                </button>
                <button 
                  type="button" 
                  onClick={handleResetForm}
                  className={styles['btn-secondary']}
                  disabled={isSubmitting}
                >
                  Reset Form
                </button>
                {selectedLocation && (
                  <button 
                    type="button" 
                    onClick={handleClearSelection}
                    className={styles['btn-secondary']}
                    disabled={isSubmitting}
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              <div style={{ 
                fontSize: '12px', 
                marginTop: '10px', 
                color: selectedLocation ? 'green' : 'red' 
              }}>
                {selectedLocation 
                  ? `Location selected at [${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}]`
                  : 'Click on map to select location for this facility.'
                }
              </div>

              <div style={{ fontSize: '12px', marginTop: '5px', color: 'blue' }}>
                Facilities on map: {allPlaces.length}
              </div>

              {/* Debug info */}
              <div style={{ fontSize: '10px', marginTop: '10px', color: 'gray', maxHeight: '100px', overflow: 'auto' }}>
                <strong>Debug Info:</strong>
                <div>Markers loaded: {allPlaces.length}</div>
                {allPlaces.slice(0, 3).map((p, i) => (
                  <div key={i}>{p.name} - {p.lat?.toFixed(4)}, {p.lng?.toFixed(4)}</div>
                ))}
                {allPlaces.length > 3 && <div>... and {allPlaces.length - 3} more</div>}
              </div>
            </form>
          </div>

          {/* Map */}
          <div className={styles['map-container']}>
            {currentLocation ? (
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '600px', width: '100%' }}
                key={JSON.stringify(mapCenter)}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <LocationHandler />
                <MapClickHandler />

                {/* User location */}
                {currentLocation && (
                  <Marker 
                    position={[currentLocation.lat, currentLocation.lng]} 
                    icon={userIcon}
                  >
                    <Popup>
                      <strong>Your Current Location</strong>
                    </Popup>
                  </Marker>
                )}

                {/* Selected location */}
                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                    icon={getIcon(selectedLocationType || newPlace.type)}
                  >
                    <Popup>
                      <strong>Selected Location</strong><br />
                      {newPlace.name || 'New Facility'}<br />
                      Type: {selectedLocationType || newPlace.type || 'Not selected'}
                      {!newPlace.name && (
                        <>
                          <br />
                          <em>Fill the form to add details</em>
                        </>
                      )}
                    </Popup>
                  </Marker>
                )}

                {/* Existing facilities */}
                {allPlaces.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={getIcon(place.type)}
                  >
                    <Popup>
                      <strong>{place.name}</strong><br />
                      {place.description}<br />
                      Type: {place.type}<br />
                      {place.verified && <span style={{color: 'green'}}>✓ Verified</span>}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div style={{ 
                height: '600px', 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #ccc'
              }}>
                Loading map...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityMapPage