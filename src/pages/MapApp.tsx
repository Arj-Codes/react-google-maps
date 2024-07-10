import CurrentLocation from "@/components/CurrentLocation";
import { Skeleton } from "@/components/ui/skeleton";
import { LocationProp } from "@/Props";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api"
import { useState } from "react";

const MapApp = () => {
  const [position, setPosition] = useState<LocationProp>({
    lat: 0,
    lng: 0
  });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  })

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);


  if (!isLoaded) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-black" />
        <Skeleton className="h-4 w-[200px] bg-black" />
      </div>
    )
  }

  const onMarkerLoad = (marker: google.maps.Marker) => {
    setMarker(marker);
  };


  return (
    <div>
      <div className="w-[60%] mx-auto h-[100vh] relative">
        <div className="CurrentLocation absolute top-5 w-[90%] left-1/2 -translate-x-1/2 bg-white rounded-lg z-40">
          <CurrentLocation location={position} setLocation={setPosition} map={map} marker={marker}/>
        </div>
        <div className="map h-[100vh] w-[100%] absolute top-0 left-0">
          <GoogleMap
            center={position}
            zoom={20}
            mapContainerStyle={{ width: '100%', height: "100%" }}
            options={
              {
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false
              }
            }
            onLoad={(map) => setMap(map)}
          >
            <MarkerF position={position} onLoad={onMarkerLoad} visible={true} draggable onDragEnd={(e) => {
              if (e.latLng)
                setPosition({
                  lat: e.latLng?.lat(),
                  lng: e.latLng?.lng()
                })
            }} />
          </GoogleMap>
        </div>
      </div>
    </div>
  )
}

export default MapApp