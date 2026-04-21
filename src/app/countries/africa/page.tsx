import CountryExplorerLayout from "../../components/CountryExplorerLayout";

export default function AfricaPage() {
  return (
    <CountryExplorerLayout
      title="Africa"
      continent="africa"
      countries={[
        "Nigeria",
        "Niger",
        "Kenya",
        "Ethiopia",
        "Uganda",
        "Rwanda",
        "Zambia",
        "Zimbabwe",
      ]}
    />
  );
}
