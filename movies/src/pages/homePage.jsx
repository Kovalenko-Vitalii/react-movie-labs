import React, { useMemo, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import FilterMoviesCard from "../components/filterMoviesCard";
import { useQuery } from "@tanstack/react-query";
import { getDiscoverMovies } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";

export default function HomePage() {
  const [filtersDraft, setFiltersDraft] = useState({
    name: "", genre: "0", sort: "popularity.desc", year: "", adult: false,
  });
  const [filtersApplied, setFiltersApplied] = useState(filtersDraft);

  const onUserInput = (type, value) =>
    setFiltersDraft(prev => ({ ...prev, [type]: value }));

  const onSearch = () => setFiltersApplied(filtersDraft);

  const params = useMemo(() => ({
    sort_by: filtersApplied.sort,
    with_genres: filtersApplied.genre !== "0" ? String(filtersApplied.genre) : undefined,
    primary_release_year: filtersApplied.year || undefined,
    include_adult: filtersApplied.adult ? "true" : "false",
  }), [filtersApplied]);

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["movies","discover", params],
    queryFn: () => getDiscoverMovies(params),
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1 style={{padding:24}}>{error.message}</h1>;

  const movies = (data?.results ?? []).filter(m =>
    m.title?.toLowerCase().includes((filtersApplied.name || "").toLowerCase())
  );

  return (
    <PageTemplate
      title="Discover Movies"
      movies={movies}
      action={(movie) => <AddToFavoritesIcon movie={movie} />}
      filterProps={{
        onUserInput,
        onSearch,                           
        titleFilter: filtersDraft.name,
        genreFilter: filtersDraft.genre,
        sort: filtersDraft.sort,
        year: filtersDraft.year,
        adult: filtersDraft.adult,
      }}
    />
  );
}
