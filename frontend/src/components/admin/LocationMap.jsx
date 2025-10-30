import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from 'react-leaflet';

const LocationMap = ({ teachers, geofences }) => {
  // Default center if no geofences exist
  const defaultCenter = [12.9716, 77.5946];
  const mapCenter =
    geofences.length > 0
      ? [geofences[0].center.lat, geofences[0].center.lng]
      : defaultCenter;

  return (
    <MapContainer
      center={mapCenter}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Draw Geofences */}
      {geofences.map((fence) => (
        <Circle
          key={fence._id}
          center={[fence.center.lat, fence.center.lng]}
          radius={fence.radiusMeters}
          pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
        >
          <Popup>{fence.name}</Popup>
        </Circle>
      ))}

      {/* Draw Teacher Markers */}
      {teachers
        .filter((teacher) => teacher.presenceHistory?.location) // Only show teachers with a location
        .map((teacher) => (
          <Marker
            key={teacher._id}
            position={[
              teacher.presenceHistory.location.lat,
              teacher.presenceHistory.location.lng,
            ]}
          >
            <Popup>
              <strong>{teacher.name}</strong>
              <br />
              Status: {teacher.onPremises ? 'Inside' : 'Outside'}
              <br />
              Last seen: {new Date(teacher.lastSeen).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default LocationMap;