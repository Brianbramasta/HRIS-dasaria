import Button from "@/components/ui/button/Button";
const apiUrl = globalThis.API_URL;
const apiPrefix = globalThis.API_PREFIX;

interface Props {
  types: string[];
  onGenerated?: () => void;
}

export default function DevGeneratePayrollButton({ types, onGenerated }: Props) {
  if (import.meta.env.VITE_APP_ENV !== "dev") return null;

  const handleGenerate = async () => {
    const query = types.map((t) => `type=${t}`).join("&");

    try {
      await fetch(
        `${apiUrl}${apiPrefix}/payroll/payroll-periode/tes/payroll-periode?${query}`,
        {
          method: "get",
        }
      );

      onGenerated?.();
    } catch (err) {
      console.error("Generate payroll gagal", err);
    }
  };

  return (
    <Button variant="primary" onClick={handleGenerate}>
      Generate Payroll (DEV)
    </Button>
  );
}