import React, { useContext, useState, useMemo, useCallback, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromWatchList from "../components/cardIcons/removeFromWatchList";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const PAGE_SIZE = 20;

export default function WatchListPage() {
  const { mustWatch: movieIds = [] } = useContext(MoviesContext);

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
    setFiltersApplied(filtersDraft);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filtersDraft]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["watchlist", movieIds],
    enabled: movieIds.length > 0,
    queryFn: () =>
      Promise.all(movieIds.map((id) => getMovie({ queryKey: ["movie", { id }] }))),
  });

  const movies = useMemo(
    () =>
      (data ?? []).map((m) => ({
        ...m,
        genre_ids: (m.genres || []).map((g) => g.id),
      })),
    [data]
  );

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

  const totalPages = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return displayed.slice(start, start + PAGE_SIZE);
  }, [displayed, page]);

  return (
    <>
      {movieIds.length === 0 ? (
        <PageTemplate
          title="Watchlist"
          movies={[]}
          action={() => null}
          filterProps={{
            onUserInput,
            onSearch,
            titleFilter: filtersDraft.name,
            genreFilter: filtersDraft.genre,
            sort: filtersDraft.sort,
            year: filtersDraft.year,
            adult: filtersDraft.adult,
          }}
          footer={null}
        />
      ) : isPending ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Spinner />
        </Box>
      ) : isError ? (
        <p style={{ padding: 24 }}>{String(error?.message || error)}</p>
      ) : (
        <PageTemplate
          title="Watchlist"
          movies={paged}
          action={(movie) => <RemoveFromWatchList movie={movie} />}
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
                count={totalPages}
                onChange={(_, p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </Stack>
          }
        />
      )}
    </>
  );
}
