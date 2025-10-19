import React from "react";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import { getPopularMovies } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToWatchlist from "../components/cardIcons/addToWatchList";

export default function PopularMoviesPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["popular"],
    queryFn: getPopularMovies,
  });

  if (isPending) return <Spinner />;
  if (isError) return <p style={{ padding: 24 }}>{String(error?.message || error)}</p>;

  const movies = data?.results ?? [];
  return (
    <PageTemplate
      //key="popular"
      title="Popular Movies"
      movies={movies}
      action={(m) => <AddToWatchlist movie={m} />}
    />
  );
}
