interface Props {
  filterNames: string[] | undefined;
}

function removeFilterUrl(name: string) {
  const url = new URL(globalThis.window.location.href);
  const params = url.searchParams;

  const newParams = new URLSearchParams();

  let removed = false;

  params.forEach((value, key) => {
    if (key === "filtro" && value.includes(name) && !removed) {
      removed = true;
    } else {
      newParams.append(key, value);
    }
  });

  url.search = newParams.toString();

  globalThis.window.location.href = url.toString();
}

function removeAllFilters() {
  const url = new URL(globalThis.window.location.href);
  const params = url.searchParams;
  while (params.has("filtro")) {
    params.delete("filtro");
  }

  globalThis.window.location.href = url.toString();
}

function RemoveFilter({ filterNames }: Props) {
  return (
    (filterNames && filterNames.length > 0)
      ? (
        <>
          <div className="flex py-4 px-3 flex-col border-b border-base-300 group">
            <div className="flex justify-between font-bold">
              <span>Filtros Selecionados</span>
              <span
                className="underline cursor-pointer"
                onClick={() => removeAllFilters()}
              >
                Limpar tudo
              </span>
            </div>
          </div>
          <ul className="py-4 px-3 flex gap-2 flex-col">
            {filterNames.map((item, index) => (
              <div
                key={item || index} // Use uma key única e estável
                className="px-3 flex py-1.5 cursor-pointer gap-1 border border-[#212529] rounded w-fit"
                data-teste
                onClick={() => removeFilterUrl(item)} // Corrigido para passar o evento se necessário em removeFilterUrl
              >
                {item}
                <div className="flex items-center">
                  {/* Corrigido 'class' para 'className' e use currentColor para preenchimento */}
                  <svg
                    className="cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4.64543 4.64518C4.69187 4.59862 4.74705 4.56168 4.8078 4.53647C4.86854 4.51127 4.93366 4.49829 4.99943 4.49829C5.0652 4.49829 5.13032 4.51127 5.19106 4.53647C5.25181 4.56168 5.30698 4.59862 5.35343 4.64518L7.99943 7.29218L10.6454 4.64518C10.6919 4.5987 10.7471 4.56182 10.8078 4.53666C10.8686 4.5115 10.9337 4.49855 10.9994 4.49855C11.0652 4.49855 11.1303 4.5115 11.191 4.53666C11.2518 4.56182 11.3069 4.5987 11.3534 4.64518C11.3999 4.69167 11.4368 4.74686 11.462 4.8076C11.4871 4.86834 11.5001 4.93344 11.5001 4.99918C11.5001 5.06493 11.4871 5.13003 11.462 5.19077C11.4368 5.25151 11.3999 5.3067 11.3534 5.35318L8.70643 7.99918L11.3534 10.6452C11.3999 10.6917 11.4368 10.7469 11.462 10.8076C11.4871 10.8683 11.5001 10.9334 11.5001 10.9992C11.5001 11.0649 11.4871 11.13 11.462 11.1908C11.4368 11.2515 11.3999 11.3067 11.3534 11.3532C11.3069 11.3997 11.2518 11.4365 11.191 11.4617C11.1303 11.4869 11.0652 11.4998 10.9994 11.4998C10.9337 11.4998 10.8686 11.4869 10.8078 11.4617C10.7471 11.4365 10.6919 11.3997 10.6454 11.3532L7.99943 8.70618L5.35343 11.3532C5.30694 11.3997 5.25175 11.4365 5.19101 11.4617C5.13027 11.4869 5.06517 11.4998 4.99943 11.4998C4.93368 11.4998 4.86858 11.4869 4.80785 11.4617C4.74711 11.4365 4.69192 11.3997 4.64543 11.3532C4.59894 11.3067 4.56206 11.2515 4.53691 11.1908C4.51175 11.13 4.4988 11.0649 4.4988 10.9992C4.4988 10.9334 4.51175 10.8683 4.53691 10.8076C4.56206 10.7469 4.59894 10.6917 4.64543 10.6452L7.29243 7.99918L4.64543 5.35318C4.59887 5.30674 4.56192 5.25156 4.53672 5.19082C4.51151 5.13007 4.49854 5.06495 4.49854 4.99918C4.49854 4.93342 4.51151 4.8683 4.53672 4.80755C4.56192 4.74681 4.59887 4.69163 4.64543 4.64518Z"
                      fill="#212529"
                    >
                    </path>
                  </svg>
                </div>
              </div>
            ))}
          </ul>
        </>
      )
      : <></> // Retorna um Fragment vazio se não houver filtros
  );
}

export default RemoveFilter;
