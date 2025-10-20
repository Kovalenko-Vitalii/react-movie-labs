import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import img from "../../images/pexels-dziana-hasanbekava-5480827.jpg";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../../api/tmdb-api";
import Spinner from "../spinner";

const fc = { my: 1.5, width: "100%" };

export default function FilterMoviesCard(props) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const genres = (() => {
    const arr = Array.isArray(data?.genres) ? [...data.genres] : [];
    if (!arr.length || arr[0]?.name !== "All") arr.unshift({ id: "0", name: "All" });
    return arr;
  })();

  const change = (type) => (e) => props.onUserInput(type, e.target?.value ?? e);

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#fff",
      }}
      variant="outlined"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <SearchIcon />
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Filter the movies
        </Typography>
      </Box>

      <CardContent sx={{ px: 3, pt: 2, pb: 3 }}>
        <TextField
          sx={fc}
          label="Search by title"
          type="search"
          variant="outlined"
          size="small"
          fullWidth
          value={props.titleFilter ?? ""}
          onChange={change("name")}
        />

        <FormControl sx={fc} size="small" fullWidth>
          <InputLabel id="genre-label">Genre</InputLabel>
          <Select
            labelId="genre-label"
            value={props.genreFilter ?? "0"}
            label="Genre"
            onChange={change("genre")}
          >
            {genres.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={fc} size="small" fullWidth>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            value={props.sort ?? "popularity.desc"}
            label="Sort by"
            onChange={change("sort")}
          >
            <MenuItem value="popularity.desc">Popularity ↓</MenuItem>
            <MenuItem value="popularity.asc">Popularity ↑</MenuItem>
            <MenuItem value="vote_average.desc">Rating ↓</MenuItem>
            <MenuItem value="vote_average.asc">Rating ↑</MenuItem>
            <MenuItem value="primary_release_date.desc">Release date ↓</MenuItem>
            <MenuItem value="primary_release_date.asc">Release date ↑</MenuItem>
          </Select>
        </FormControl>

        <TextField
          sx={fc}
          label="Year (e.g. 2024)"
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          value={props.year ?? ""}
          onChange={change("year")}
          inputProps={{ min: 1900, max: 2100 }}
        />

        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Switch
              color="primary"
              checked={Boolean(props.adult)}
              onChange={(e) => props.onUserInput("adult", e.target.checked)}
            />
          }
          label="Include adult"
        />

        <Button
          variant="contained"
          color="primary"
          size="medium"
          sx={{ mt: 2 }}
          onClick={props.onSearch}
          startIcon={<SearchIcon />}
          fullWidth
        >
          Search
        </Button>
      </CardContent>

      <Box sx={{ position: "relative" }}>
        <CardMedia sx={{ height: 160 }} image={img} title="Filter" />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(25,118,210,0.2) 0%, rgba(25,118,210,0.4) 100%)",
            pointerEvents: "none",
          }}
        />
      </Box>
    </Card>
  );
}
