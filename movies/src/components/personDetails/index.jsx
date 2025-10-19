import React, { useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TemplateMovieListPage from "../templateMovieListPage";
import MovieCard from "../movieCard";
import MovieList from "../movieList";

const PersonDetails = ({ person, credits }) => {
  const [expanded, setExpanded] = useState(false);
  const bio = person.biography || "";
  const bioText = !expanded && bio.length > 600 ? bio.slice(0, 600) + "…" : bio;

  const movies = useMemo(() => {
    const items = (credits?.cast ?? [])
      .filter((c) => c.media_type === "movie" && (c.poster_path || c.backdrop_path))
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

    const seen = new Set();
    return items.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
  }, [credits]);

  return (
    <div>
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {person.known_for_department && <Chip color="primary" label={person.known_for_department} />}
        {person.place_of_birth && <Chip label={person.place_of_birth} />}
        {person.birthday && <Chip label={`Born: ${person.birthday}`} />}
      </Box>

      {bio && (
        <>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 1.5 }}>
            {bioText}
          </Typography>
          {bio.length > 600 && (
            <Button size="small" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Show less" : "Read more"}
            </Button>
          )}
        </>
      )}

      <h3 style={{ marginTop: 24, marginBottom: 8 }}>Known for</h3>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {movies.slice(0, 12).map((m) => (
          <MovieCard key={m.id} movie={m} action={() => null} />
        ))}
      </div>
    </div>
  );
};

export default PersonDetails;
