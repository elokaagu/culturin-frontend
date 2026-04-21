import CountryExplorerLayout from "../../components/CountryExplorerLayout";

export default function EuropePage() {
  return (
    <CountryExplorerLayout
      title="Europe"
      continent="europe"
      countries={[
        "UK",
        "France",
        "Spain",
        "The Netherlands",
        "Portugal",
        "Austria",
        "Germany",
      ]}
    />
  );
}
