import type { SeriesResponse } from "@/types/series/series";
import { DetailTabs } from "@/components/Details/DetailTabs";
import { DetailFacts, DetailOverview } from "@/components/Details/DetailInformation";

export function SeriesInfoTabs({ series }: { series: SeriesResponse }) {
  const people = series.creators.map((item) => item.name);
  const peopleLabel = people.length > 1 ? "Creators" : "Creator";
  return <DetailTabs label="Series information"
    overview={<DetailOverview synopsis={series.synopsis} rating={series.tmdbVoteAverage}
      certification={series.certificationFr} peopleLabel={peopleLabel} people={people} genres={series.genres} />}
    details={<DetailFacts originalTitle={series.originalTitle} releaseDate={series.releaseDate}
      releaseLabel="First aired" certification={series.certificationFr}
      companies={series.productionCompanies.map((item) => item.name)} rating={series.tmdbVoteAverage}
      voteCount={series.tmdbVoteCount} peopleLabel={peopleLabel} people={people} actors={series.actors} />} />;
}
