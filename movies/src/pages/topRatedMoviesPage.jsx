import React, { useState, useMemo, useCallback } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import { getDiscoverMovies } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToWatchListIcon from "../components/cardIcons/addToWatchList";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function TopRatedMoviesPage() {
  const [page, setPage] = useState(1);

  const [filtersDraft, setFiltersDraft] = useState({
    name: "",
    genre: "0",
    sort: "vote_average.desc",
    year: "",
    adult: false,
  });
  const [filtersApplied, setFiltersApplied] = useState(filtersDraft);

  const onUserInput = useCallback((type, value) => {
    setFiltersDraft((prev) => ({ ...prev, [type]: value }));
  }, []);

  const onSearch = useCallback(() => {
    setFiltersApplied(filtersDraft);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filtersDraft]);

  const params = useMemo(() => {
    return {
      sort_by: filtersApplied.sort || "vote_average.desc",
      with_genres:
        filtersApplied.genre !== "0" ? String(filtersApplied.genre) : undefined,
      primary_release_year: filtersApplied.year || undefined,
      include_adult: filtersApplied.adult ? "true" : "false",
      page: String(page),
      "vote_count.gte": "200",
    };
  }, [filtersApplied, page]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["movies", "top_rated_discover", params],
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
      title="Top-Rated Movies"
      movies={movies}
      action={(m) => <AddToWatchListIcon movie={m} />}
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
