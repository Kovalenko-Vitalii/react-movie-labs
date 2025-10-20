import React, { useState, useMemo, useCallback } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import { getTopRatedMovies } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import AddToWatchListIcon from "../components/cardIcons/addToWatchList";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function TopRatedMoviesPage() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["movies", "top_rated", page],
    queryFn: () => getTopRatedMovies(page),
  });

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
    setFiltersApplied(filtersDraft);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filtersDraft]);

  const movies = data?.results ?? [];

  const displayed = useMemo(() => {
    let list = movies.filter((m) =>
      (m.title || "").toLowerCase().includes((filtersApplied.name || "").toLowerCase())
    );

    const gid = Number(filtersApplied.genre);
    if (gid > 0) list = list.filter((m) => (m.genre_ids || []).includes(gid));

    const y = Number(filtersApplied.year);
    if (y > 0) list = list.filter((m) => (m.release_date || "").startsWith(`${y}-`));

    const keyMap = {
      popularity: (m) => m.popularity ?? 0,
      vote_average: (m) => m.vote_average ?? 0,
      primary_release_date: (m) => new Date(m.release_date || 0).getTime(),
    };
    const [key, dir] = (filtersApplied.sort || "popularity.desc").split(".");
    const getter = keyMap[key] || keyMap.popularity;
    const mult = dir === "asc" ? 1 : -1;

    return [...list].sort((a, b) => {
      const va = getter(a);
      const vb = getter(b);
      return (va === vb ? 0 : va > vb ? 1 : -1) * mult;
    });
  }, [movies, filtersApplied]);

  if (isPending) return <Spinner />;
  if (isError) return <p style={{ padding: 24 }}>{String(error?.message || error)}</p>;

  return (
    <PageTemplate
      title="Top-Rated Movies"
      movies={displayed}
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
