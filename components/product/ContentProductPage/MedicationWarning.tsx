// Arquivo: components/product/ContentProductPage/MedicationWarning.tsx
import { ProductVariation } from "../../../commerce/ContentTypes.ts";

interface MedicationWarningProps {
  contentPage: ProductVariation;
}

/**
 * Componente que exibe aviso de segurança para medicamentos
 * Só é exibido quando o produto é um medicamento
 */
export function MedicationWarning({ contentPage }: MedicationWarningProps) {
  // Verifica se é um medicamento baseado na presença de atributos específicos
  const isMedication = !!contentPage.product?.substance &&
    !!contentPage.product?.prescriptionType;

  if (!isMedication) return null;

  const productTitle = contentPage.product?.title || contentPage.title;

  return (
    <div className="px-2">
      <div className="text-sm font-normal leading-[21px] rounded-[4px] bg-[#E2E6EA] border border-[#cbd3da] p-4 uppercase mb-8">
        {productTitle}{" "}
        É UM MEDICAMENTO. SEU USO PODE TRAZER RISCOS. PROCURE UM MÉDICO OU UM
        FARMACÊUTICO. LEIA A BULA. MEDICAMENTOS PODEM CAUSAR EFEITOS
        INDESEJADOS. EVITE A AUTOMEDICAÇÃO: INFORME-SE COM SEU MÉDICO OU
        FARMACÊUTICO.
      </div>
    </div>
  );
}

export default MedicationWarning;
