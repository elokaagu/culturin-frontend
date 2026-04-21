import CountryExplorerLayout from "../../components/CountryExplorerLayout";

export default function AsiaPage() {
  return (
    <CountryExplorerLayout
      title="Asia"
      continent="asia"
      countries={[
        "China",
        "Japan",
        "South Korea",
        "Taiwan",
        "Bali",
        "India",
        "Pakistan",
        "Thailand",
      ]}
    />
  );
}
