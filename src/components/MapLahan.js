import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icon marker
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// DATA DUMMY LAHAN
const dataLahan = [
  {
    id: 1,
    nama: "Lahan Jember 01",
    pemilik: "Petani 01",
    kecamatan: "Sumbersari",
    latitude: -8.1555,
    longitude: 113.7222
  },
  {
    id: 2,
    nama: "Lahan Jember 02",
    pemilik: "Petani 02",
    kecamatan: "Patrang",
    latitude: -8.1505,
    longitude: 113.7085
  },
  {
    id: 3,
    nama: "Lahan Jember 03",
    pemilik: "Petani 03",
    kecamatan: "Kaliwates",
    latitude: -8.1735,
    longitude: 113.6965
  },
  {
    id: 4,
    nama: "Lahan Jember 04",
    pemilik: "Petani 04",
    kecamatan: "Ajung",
    latitude: -8.1905,
    longitude: 113.6905
  },
  {
    id: 5,
    nama: "Lahan Jember 05",
    pemilik: "Petani 05",
    kecamatan: "Pakusari",
    latitude: -8.1355,
    longitude: 113.7685
  }
];

function MapLahan() {
  // Titik tengah sekitar Kabupaten Jember
  const posisiAwal = [-8.165, 113.715];

  return (
    <div
      style={{
        width: "100%",
        height: "500px"
      }}
    >
      <MapContainer
        center={posisiAwal}
        zoom={12}
        style={{
          width: "100%",
          height: "100%"
        }}
      >

        {/* SATELLITE MAP */}
        <TileLayer
          attribution="Tiles &copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* LABEL JALAN & TEMPAT */}
        <TileLayer
          attribution="Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />

        {/* MARKER 5 LAHAN */}
        {dataLahan.map((lahan) => (
          <Marker
            key={lahan.id}
            position={[
              lahan.latitude,
              lahan.longitude
            ]}
            icon={markerIcon}
          >
            <Popup>
              <div>
                <strong>{lahan.nama}</strong>

                <br />

                Pemilik: {lahan.pemilik}

                <br />

                Kecamatan: {lahan.kecamatan}

                <br />

                Latitude: {lahan.latitude}

                <br />

                Longitude: {lahan.longitude}
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}

export default MapLahan;