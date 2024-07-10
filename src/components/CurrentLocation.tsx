import { LocationProp } from "@/Props";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import LocationInputForm from "./Forms/LocationInputForm";

const CurrentLocation: React.FC<{
  location: LocationProp,
  setLocation: React.Dispatch<React.SetStateAction<LocationProp>>,
  map: google.maps.Map | null,
  marker: google.maps.Marker | null
}> = ({ location, setLocation, map, marker }) => {
  const { coords } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });
  const [currLocation, setCurrLocation] = useState<LocationProp>({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    if (coords) {
      setLocation({
        lat: coords.latitude,
        lng: coords.longitude
      })
      setCurrLocation(
        {
          lat: coords.latitude,
          lng: coords.longitude
        }
      );
    }
  }, [coords, setLocation])

  return (
    <div className="inputs w-full p-2">
      <LocationInputForm location={location} map={map} setLocation={setLocation} currLocation={currLocation} marker={marker}/>
    </div>

  )
};

export default CurrentLocation;