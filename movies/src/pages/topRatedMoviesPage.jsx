import React from "react";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import { getTopRatedMovies } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToWatchListIcon from "../components/cardIcons/addToWatchList";
export default function TopRatedMoviesPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["movies", "top_rated"],
    queryFn: getTopRatedMovies,
  });

  if (isPending) return <Spinner />;
  if (isError) return <p style={{ padding: 24 }}>{String(error?.message || error)}</p>;

  const movies = data?.results ?? [];

  return (
    <PageTemplate
      title="Top-Rated Movies"
      movies={movies}
      action={(m) => <AddToWatchListIcon movie={m} />}
    />
  );
}
