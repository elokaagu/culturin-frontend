import CountryExplorerLayout from "../../components/CountryExplorerLayout";

export default function SouthAmericaPage() {
  return (
    <CountryExplorerLayout
      title="South America"
      continent="southAmerica"
      countries={["Brazil", "Argentina", "Chile", "Ecuador", "Peru", "Bolivia"]}
    />
  );
}
