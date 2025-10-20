import React, { useContext } from "react";
import { Link } from "react-router";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import img from "../../images/film-poster-placeholder.png";
import { MoviesContext } from "../../contexts/moviesContext";

export default function MovieCard({ movie, action }) {
  const { favorites } = useContext(MoviesContext);
  const isFavorite = favorites.includes(movie.id);

  const poster =
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      : img;

  const roundedRating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "—";

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <CardHeader
        avatar={
          isFavorite ? (
            <Avatar sx={{ bgcolor: "error.main" }}>
              <FavoriteIcon />
            </Avatar>
          ) : null
        }
        title={
          <Typography variant="h6" noWrap title={movie.title}>
            {movie.title}
          </Typography>
        }
        sx={{ pb: 0.5 }}
      />

      <Box>
        <CardMedia sx={{ height: 500, bgcolor: "#f3f5f7" }} image={poster} />
      </Box>

      <CardContent sx={{ pt: 1.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarIcon fontSize="small" />
            <Typography variant="body2">
              {movie.release_date || "—"}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <StarRateIcon fontSize="small" />
            <Typography variant="body2">{roundedRating}</Typography>
          </Stack>
        </Stack>
      </CardContent>

      <Divider />

      <CardActions
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>{action(movie)}</Box>

        <Link to={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            More info…
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
