// Arquivo: components/product/ContentProductPage/MedicationMainWarning.tsx
import { Product } from "../../../commerce/ContentTypes.ts";

interface MedicationMainWarningProps {
  contentPage: Product;
}

/**
 * Componente que exibe aviso de segurança para medicamentos
 * Versão adaptada para receber Product ao invés de ProductVariation
 * Só é exibido quando o produto é um medicamento
 */
export function MedicationMainWarning(
  { contentPage }: MedicationMainWarningProps,
) {
  // Verifica se é um medicamento baseado na presença de atributos específicos
  const isMedication = !!contentPage.substance &&
    !!contentPage.prescriptionType;

  if (!isMedication) return null;

  return (
    <div className="px-2">
      <div className="text-sm font-normal leading-[21px] rounded-[4px] bg-[#E2E6EA] border border-[#cbd3da] p-4 uppercase mb-8">
        {contentPage.title}{" "}
        É UM MEDICAMENTO. SEU USO PODE TRAZER RISCOS. PROCURE UM MÉDICO OU UM
        FARMACÊUTICO. LEIA A BULA. MEDICAMENTOS PODEM CAUSAR EFEITOS
        INDESEJADOS. EVITE A AUTOMEDICAÇÃO: INFORME-SE COM SEU MÉDICO OU
        FARMACÊUTICO.
      </div>
    </div>
  );
}

export default MedicationMainWarning;
