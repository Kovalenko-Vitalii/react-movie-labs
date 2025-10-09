import React from "react";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import { getUpcomingMovies } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToFavorites from "../components/cardIcons/addToFavorites";

export default function UpcomingMoviesPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: getUpcomingMovies,
  });

  if (isPending) return <Spinner />;
  if (isError) return <p style={{ padding: 24 }}>{String(error?.message || error)}</p>;

  const movies = data?.results ?? [];
  return (
    <PageTemplate
      title="Upcoming Movies"
      movies={movies}
      action={(m) => <AddToFavorites movie={m} />}
    />
  );
}
