import React from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid";

function MovieListPageTemplate({ movies, title, action, filterProps, footer }) {
  return (
    <Grid container>
      <Grid size={12}>
        <Header title={title} />
      </Grid>

      <Grid container sx={{ flex: "1 1 500px" }}>
        <Grid
          key="find"
          size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
          sx={{ padding: "20px" }}
        >
          {filterProps ? <FilterCard {...filterProps} /> : null}
        </Grid>

        <MovieList action={action} movies={movies} />
        {footer}
      </Grid>
    </Grid>
  );
}

export default MovieListPageTemplate;
