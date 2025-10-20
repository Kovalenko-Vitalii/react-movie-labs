import React, { useMemo, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import FilterMoviesCard from "../components/filterMoviesCard";
import { useQuery } from "@tanstack/react-query";
import { getDiscoverMovies } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function HomePage() {
  const [page, setPage] = useState(1);

  const [filtersDraft, setFiltersDraft] = useState({
    name: "",
    genre: "0",
    sort: "popularity.desc",
    year: "",
    adult: false,
  });

  const [filtersApplied, setFiltersApplied] = useState(filtersDraft);

  const onUserInput = (type, value) =>
    setFiltersDraft((prev) => ({ ...prev, [type]: value }));

  const onSearch = () => {
    setPage(1);
    setFiltersApplied(filtersDraft);
  };

  const params = useMemo(
    () => ({
      sort_by: filtersApplied.sort,
      with_genres:
        filtersApplied.genre !== "0" ? String(filtersApplied.genre) : undefined,
      primary_release_year: filtersApplied.year || undefined,
      include_adult: filtersApplied.adult ? "true" : "false",
      page: String(page),
    }),
    [filtersApplied, page]
  );

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["movies", "discover", params],
    queryFn: () => getDiscoverMovies(params),
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1 style={{ padding: 24 }}>{error.message}</h1>;

  const movies = (data?.results ?? []).filter((m) =>
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
      footer={
        <Stack alignItems="center" sx={{ mt: 2, pb: 3, width: "100%" }}>
          <Pagination
            page={page}
            count={Math.min(data?.total_pages ?? 1, 500)}
            onChange={(_, p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </Stack>
      }
    />
  );
}
