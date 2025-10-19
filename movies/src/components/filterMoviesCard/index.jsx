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
import img from "../../images/pexels-dziana-hasanbekava-5480827.jpg";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../../api/tmdb-api";
import Spinner from "../spinner";

const formControl = { margin: 1, minWidth: "90%", backgroundColor: "#fff" };

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
    <Card sx={{ backgroundColor: "rgb(204, 204, 0)" }} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
          <SearchIcon fontSize="large" /> &nbsp;Filter the movies
        </Typography>

        <TextField
          sx={formControl}
          label="Search by title"
          type="search"
          variant="filled"
          value={props.titleFilter ?? ""}
          onChange={change("name")}
        />

        <FormControl sx={formControl}>
          <InputLabel id="genre-label">Genre</InputLabel>
          <Select
            labelId="genre-label"
            value={props.genreFilter ?? "0"}
            label="Genre"
            onChange={change("genre")}
          >
            {genres.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={formControl}>
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
          sx={formControl}
          label="Year (e.g. 2024)"
          type="number"
          variant="filled"
          value={props.year ?? ""}
          onChange={change("year")}
          inputProps={{ min: 1900, max: 2100 }}
        />

        <FormControlLabel
          sx={{ ml: 1 }}
          control={
            <Switch
              checked={Boolean(props.adult)}
              onChange={(e) => props.onUserInput("adult", e.target.checked)}
            />
          }
          label="Include adult"
        />

        <Button
          variant="contained"
          sx={{ mt: 2, ml: 1 }}
          onClick={props.onSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </CardContent>

      <CardMedia sx={{ height: 300 }} image={img} title="Filter" />
    </Card>
  );
}
