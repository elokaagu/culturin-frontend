import CountryExplorerLayout from "../../components/CountryExplorerLayout";

export default function NorthAmericaPage() {
  return (
    <CountryExplorerLayout
      title="North America"
      continent="northAmerica"
      countries={["USA", "Mexico", "Caribbean", "Canada"]}
    />
  );
}
