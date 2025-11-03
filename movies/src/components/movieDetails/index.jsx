import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getMovieCredits,
  getMovieRecommendations,
  getMovieSimilar,
} from "../../api/tmdb-api";
import MovieReviews from "../movieReviews";

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";

const root = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 1.5,
  margin: 0,
};
const chip = { margin: 0.5 };

const MovieDetails = ({ movie }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const id = movie.id;
  const { data: credits, isPending: loadingCredits } = useQuery({
    queryKey: ["credits", { id }],
    queryFn: getMovieCredits,
  });
  const { data: recs, isPending: loadingRecs } = useQuery({
    queryKey: ["recs", { id }, 1],
    queryFn: getMovieRecommendations,
  });
  const { data: similar, isPending: loadingSimilar } = useQuery({
    queryKey: ["similar", { id }, 1],
    queryFn: getMovieSimilar,
  });

  return (
    <>
      <Typography variant="h5" component="h3">
        Overview
      </Typography>

      <Typography variant="h6" component="p">
        {movie.overview}
      </Typography>

      <Paper component="ul" sx={{ ...root }}>
        <li>
          <Chip label="Genres" sx={{ ...chip }} color="primary" />
        </li>
        {movie.genres.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{ ...chip }} />
          </li>
        ))}
      </Paper>

      <Paper component="ul" sx={{ ...root }}>
        <li>
          <Chip label="Production Countries" sx={{ ...chip }} color="primary" />
        </li>
        {movie.production_countries.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{ ...chip }} />
          </li>
        ))}
      </Paper>

      <Paper component="ul" sx={{ ...root }}>
        <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} />
        <Chip icon={<MonetizationIcon />} label={`${movie.revenue.toLocaleString()}`} />
        <Chip icon={<StarRate />} label={`${movie.vote_average} (${movie.vote_count})`} />
        <Chip label={`Released: ${movie.release_date}`} />
      </Paper>

      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{ position: "fixed", bottom: "1em", right: "1em" }}
      >
        <NavigationIcon />
        Reviews
      </Fab>
      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MovieReviews movie={movie} />
      </Drawer>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Cast
      </Typography>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
        {loadingCredits
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={120} height={190} />
            ))
          : (credits?.cast ?? []).slice(0, 12).map((p) => (
              <Link key={p.id} to={`/person/${p.id}`} style={{ textDecoration: "none" }}>
                <Box sx={{ width: 120 }}>
                  <Avatar
                    src={
                      p.profile_path
                        ? `https://image.tmdb.org/t/p/w185${p.profile_path}`
                        : undefined
                    }
                    alt={p.name}
                    sx={{ width: 120, height: 120, borderRadius: 2 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }} noWrap>
                    <b>{p.name}</b>
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {p.character}
                  </Typography>
                </Box>
              </Link>
            ))}
      </Box>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Recommendations
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 2,
        }}
      >
        {loadingRecs
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={220} />
            ))
          : (recs?.results ?? []).slice(0, 12).map((m) => (
              <Link key={m.id} to={`/movies/${m.id}`} style={{ textDecoration: "none" }}>
                <Box>
                  <img
                    src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                    alt={m.title}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                  <Typography variant="body2" sx={{ mt: 0.5 }} noWrap>
                    {m.title}
                  </Typography>
                </Box>
              </Link>
            ))}
      </Box>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Similar
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 2,
        }}
      >
        {loadingSimilar
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={220} />
            ))
          : (similar?.results ?? []).slice(0, 12).map((m) => (
              <Link key={m.id} to={`/movies/${m.id}`} style={{ textDecoration: "none" }}>
                <Box>
                  <img
                    src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                    alt={m.title}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                  <Typography variant="body2" sx={{ mt: 0.5 }} noWrap>
                    {m.title}
                  </Typography>
                </Box>
              </Link>
            ))}
      </Box>
    </>
  );
};

export default MovieDetails;
