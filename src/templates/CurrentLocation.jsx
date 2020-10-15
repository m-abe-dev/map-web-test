import React from "react";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";

const CurrentLocation = ({ panTo }) => {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <LocationSearchingIcon />
    </button>
  );
};

export default CurrentLocation;
