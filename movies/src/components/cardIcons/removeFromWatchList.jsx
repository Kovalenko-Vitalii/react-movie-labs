import React, { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";

export default function RemoveFromWatchList({ movie }) {
  const { removeFromMustWatch } = useContext(MoviesContext);

  const handleClick = (e) => {
    e.preventDefault();
    removeFromMustWatch(movie);
  };

  return (
    <IconButton aria-label="remove from watchlist" onClick={handleClick}>
      <PlaylistRemoveIcon color="primary" fontSize="large" />
    </IconButton>
  );
}
