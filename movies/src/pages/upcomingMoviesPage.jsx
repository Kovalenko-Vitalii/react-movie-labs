import React, { useState, useMemo, useCallback } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import { getDiscoverMovies } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToWatchlist from "../components/cardIcons/addToWatchList";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function UpcomingMoviesPage() {
  const [page, setPage] = useState(1);

  const [filtersDraft, setFiltersDraft] = useState({
    name: "",
    genre: "0",
    sort: "popularity.desc",
    year: "",
    adult: false,
  });
  const [filtersApplied, setFiltersApplied] = useState(filtersDraft);

  const onUserInput = useCallback((type, value) => {
    setFiltersDraft((prev) => ({ ...prev, [type]: value }));
  }, []);

  const onSearch = useCallback(() => {
    setPage(1);
    setFiltersApplied(filtersDraft);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filtersDraft]);

  const params = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10); 
    return {
      sort_by: filtersApplied.sort,
      with_genres:
        filtersApplied.genre !== "0" ? String(filtersApplied.genre) : undefined,
      primary_release_year: filtersApplied.year || undefined,
      include_adult: filtersApplied.adult ? "true" : "false",
      page: String(page),
      "primary_release_date.gte": today,
      with_release_type: "2|3",
    };
  }, [filtersApplied, page]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["movies", "upcoming-discover", params],
    queryFn: () => getDiscoverMovies(params),
    keepPreviousData: true,
  });

  if (isPending) return <Spinner />;
  if (isError) return <p style={{ padding: 24 }}>{String(error?.message || error)}</p>;

  const movies = (data?.results ?? []).filter((m) =>
    (m.title || "").toLowerCase().includes((filtersApplied.name || "").toLowerCase())
  );

  return (
    <PageTemplate
      title="Upcoming Movies"
      movies={movies}
      action={(m) => <AddToWatchlist movie={m} />}
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
