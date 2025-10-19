import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPerson, getPersonCombinedCredits } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import TemplatePersonPage from "../components/templatePersonPage";
import PersonDetails from "../components/personDetails";

export default function PersonPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const personQ  = useQuery({ queryKey: ["person", { id }], queryFn: getPerson });
  const creditsQ = useQuery({ queryKey: ["personCombined", { id }], queryFn: getPersonCombinedCredits });

  if (personQ.isPending || creditsQ.isPending) return <Spinner />;
  if (personQ.isError)  return <h1>{personQ.error.message}</h1>;
  if (creditsQ.isError) return <h1>{creditsQ.error.message}</h1>;

  return (
    <div style={{ maxWidth: 1180, margin: "16px auto", padding: "0 12px" }}>
      <TemplatePersonPage person={personQ.data}>
        <PersonDetails person={personQ.data} credits={creditsQ.data} />
      </TemplatePersonPage>
    </div>
  );
}
