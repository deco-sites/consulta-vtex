import { formatPriceNew } from "../../../sdk/format.ts";
import { PropertyValue } from "../../../commerce/types.ts";

interface Props {
  bestPrice: number | undefined;
  worsePrice: number | undefined;
  quantity: PropertyValue | undefined;
  medicineType?: PropertyValue | undefined;
  pricePerMeasureMedicine?:
    | {
      measure: string | null | undefined;
      quantidadeDivisoria: number | null;
    }
    | false;
}

function PriceOffer({
  bestPrice,
  worsePrice,
  quantity,
  medicineType,
  pricePerMeasureMedicine,
}: Props) {
  let valueMedicine;
  if (pricePerMeasureMedicine && pricePerMeasureMedicine?.quantidadeDivisoria) {
    valueMedicine = bestPrice! / pricePerMeasureMedicine?.quantidadeDivisoria;
  }

  return (
    <>
      {bestPrice && (
        <div class="px-2 py-4">
          <div class="flex gap-1 items-end">
            <div class="text-sm flex gap-1 items-start leading-[21px]">
              R${" "}
              <span class="text-2xl font-medium text-info leading-[1.2]">
                {formatPriceNew(bestPrice)}
              </span>
            </div>
            {worsePrice && worsePrice > bestPrice && (
              <div>
                <span class="text-sm  leading-[1.2] line-through text-secondary">
                  R$ {formatPriceNew(worsePrice)}
                </span>
              </div>
            )}
          </div>
          {worsePrice && worsePrice > bestPrice && (
            <div>
              <div>
                <span class="text-success font-light mr-2 text-sm text-nowrap py-1 ">
                  Economize R$
                  {formatPriceNew(worsePrice! - bestPrice)}
                </span>
                <span class="bg-success text-xs text-white py-1 rounded font-bold px-2">
                  {worsePrice && bestPrice
                    ? Math.round(((worsePrice - bestPrice) / worsePrice) * 100)
                    : 0} % OFF
                </span>
              </div>
            </div>
          )}
          {pricePerMeasureMedicine && (
            <span className="text-secondary text-sm leading-[1.5]">
              R$ {formatPriceNew(valueMedicine!)}/
              {pricePerMeasureMedicine.measure?.toLocaleLowerCase()}
            </span>
          )}
        </div>
      )}
    </>
  );
}

export default PriceOffer;
