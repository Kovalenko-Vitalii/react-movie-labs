import React from "react";
import MovieHeader from "../headerMovieList";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const TemplatePersonPage = ({ person, children }) => {
  return (
    <>
      <MovieHeader title={person.name} />

      <Grid container spacing={5} style={{ padding: "15px" }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={3}
            sx={{
              p: 1.5,
              display: "flex",
              justifyContent: "center",
              bgcolor: "#fafafa",
            }}
          >
            <img
              src={
                person.profile_path
                  ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={person.name}
              style={{
                width: "100%",
                borderRadius: 8,
                objectFit: "cover",
                maxHeight: "85vh",
              }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default TemplatePersonPage;
