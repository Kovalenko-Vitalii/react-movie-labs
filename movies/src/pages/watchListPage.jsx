import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromWatchList from "../components/cardIcons/removeFromWatchList";

export default function WatchListPage() {
  const { mustWatch: movieIds = [] } = useContext(MoviesContext);

  if (!movieIds.length) {
    return <PageTemplate title="Watchlist" movies={[]} action={() => null} />;
  }

  const queries = useQueries({
    queries: movieIds.map((id) => ({
      queryKey: ["movie", { id }],
      queryFn: getMovie,
    })),
  });

  if (queries.some((q) => q.isPending)) return <Spinner />;
  if (queries.some((q) => q.isError)) return <p style={{padding:24}}>Failed to load watchlist.</p>;

  const movies = queries.map((q) => {
    const m = q.data;
    m.genre_ids = (m.genres || []).map((g) => g.id);
    return m;
  });

  return (
    <PageTemplate
      title="Watchlist"
      movies={movies}
      action={(movie) => <RemoveFromWatchList movie={movie} />}
    />
  );
}
