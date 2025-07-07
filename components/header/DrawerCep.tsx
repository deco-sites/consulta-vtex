import { useUI } from "../../sdk/useUI.ts";
import Icon from "../../components/ui/Icon.tsx";
import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { invoke } from "../../runtime.ts";
import type { Person } from "../../commerce/types.ts";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const setCepCookie = async (cep: string): Promise<void> => {
  const maxAge = 60 * 60 * 24 * 365; // 1 ano em segundos
  document.cookie =
    `user_cep=${cep}; path=/; max-age=${maxAge}; Secure; SameSite=Lax`;

  const { accessToken } = useUI();
  try {
    const coordinates = await fetchCoordinatesByCep(cep);

    console.log("coordinates", coordinates);

    if (!coordinates) {
      console.warn("Nenhuma coordenada encontrada para o CEP.");
      accessToken.value = undefined;
      document.cookie =
        `partner-token-sf=${null}; path=/; max-age=${maxAge}; Secure; SameSite=Lax`;
      return;
    }

    const partner = await invoke.site.loaders.partenerByCoordinates(
      coordinates,
    );
    const number = Math.floor(1000000000 + Math.random() * 9000000000);
    console.log("token add", partner?.partnerAccessToken);
    console.log("token valido", !!partner?.partnerAccessToken);

    accessToken.value = partner?.partnerAccessToken ?? number;

    document.cookie = `partner-token-sf=${
      partner?.partnerAccessToken ?? number
    }; path=/; max-age=${maxAge}; Secure; SameSite=Lax`;
  } catch (error) {
    console.error("Erro geral:", error);
  }
};

const fetchCoordinatesByCep = async (
  cep: string,
): Promise<Coordinates | null> => {
  const apiKey = "4a2628ecd0414a5493a1ac4e8c7a5fe0";

  // Chama o validador que retorna os dados do endereço Formatted
  const cepFormatted = await invoke.site.loaders.CepValidator({ cep });

  if (!cepFormatted || !cepFormatted.data) {
    console.log("CEP inválido ou dados não encontrados");
  }

  // Monta o endereço completo para a query da API
  const fullAddress =
    `${cepFormatted?.data?.logradouro}, ${cepFormatted?.data?.complemento}, ${cepFormatted?.data?.bairro}, ${cepFormatted?.data?.localidade}, ${cepFormatted?.data?.uf}, ${cepFormatted?.data?.cep}`;

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${
    encodeURIComponent(
      cepFormatted?.data?.logradouro ? fullAddress : cep,
    )
  }&key=${apiKey}&language=pt&countrycode=br`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar coordenadas: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const result = data.results[0];

  return {
    latitude: result.geometry.lat,
    longitude: result.geometry.lng,
  };
};

// Função para obter o CEP dos cookies
const getCepFromCookies = (): string | null => {
  const match = document.cookie.match(/(^|;)\s*user_cep\s*=\s*([^;]+)/);
  return match ? match[2] : null;
};

// Função para formatar o CEP
const formatCep = (value: string): string => {
  // Remove tudo que não é número
  let numericValue = value.replace(/\D/g, "");

  // Verifica se tem mais de 5 dígitos para adicionar o hífen
  if (numericValue.length > 5) {
    // Adiciona o hífen no lugar certo (após o 5º dígito)
    numericValue = numericValue.substring(0, 5) + "-" +
      numericValue.substring(5);
  }

  return numericValue;
};

// Mapa de siglas de estados para nomes completos
const estadosPorSigla: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

// Interface para os dados de endereço
interface adressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

// Interface para os endereços do usuário
interface UserAddress {
  address: string;
  addressDetails: string | null;
  addressNumber: string;
  cep: string;
  city: string;
  country: string;
  id: string;
  neighborhood: string;
  street: string;
  state: string;
  referencePoint: string | null;
  phone: string | null;
  receiverName: string;
  name: string;
  email: string | null;
  address2: string | null;
}

// Tipos de seleção possíveis
type TipoSelecao = "api" | "usuario";

function DrawerCep() {
  const { displayCepDrawer, cepDrawer } = useUI();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isLoading = useSignal(false);
  const error = useSignal<string | null>(null);

  // Endereço da API (baseado no CEP digitado)
  const adressApi = useSignal<adressData | null>(null);
  const visibleApiAddress = useSignal(false);

  // Dados do usuário e seus endereços
  const userData = useSignal<Person | null>(null);
  const userAddresses = useSignal<UserAddress[]>([]);
  const isLoadingUser = useSignal(false);

  // Controle do endereço selecionado
  const typeSelected = useSignal<TipoSelecao | null>(null);
  const selectedAddressId = useSignal<string | null>(null);

  // Função para carregar os dados do usuário
  async function loadUserData() {
    isLoadingUser.value = true;

    try {
      // Chama o loader de usuário
      const user = await invoke.site.loaders.user({});

      userData.value = user;

      if (user && user.addresses && user.addresses.length > 0) {
        userAddresses.value = user.addresses as UserAddress[];
      } else {
        userAddresses.value = [];
      }
    } catch (e) {
      console.error("Erro ao carregar dados do usuário:", e);
      userAddresses.value = [];
    } finally {
      isLoadingUser.value = false;
    }
  }

  // Função para selecionar o endereço da API
  function selectAdressApi() {
    if (!adressApi.value) return;

    // Marca o tipo de seleção como "api"
    typeSelected.value = "api";
    selectedAddressId.value = null;

    // Atualiza o CEP no input e no estado global/cookies
    const cepFormatted = adressApi.value.cep;

    if (inputRef.current) {
      inputRef.current.value = cepFormatted;
    }

    cepDrawer.value = cepFormatted;
    displayCepDrawer.value = false;
    setCepCookie(cepFormatted);
  }

  // Função para selecionar um endereço do usuário
  function selectUserAddress(adress: UserAddress) {
    if (!adress.cep) return;

    // Atualiza o CEP selecionado
    const cepFormatted = formatCep(adress.cep);

    // Marca o tipo de seleção como "usuario" e guarda o ID
    typeSelected.value = "usuario";
    selectedAddressId.value = adress.id;

    // Atualiza o CEP no input e no estado global/cookies
    if (inputRef.current) {
      inputRef.current.value = cepFormatted;
    }

    cepDrawer.value = cepFormatted;
    setCepCookie(cepFormatted);

    displayCepDrawer.value = false;
  }

  // Função para carregar o endereço da API baseado no CEP inicial
  async function loadInitialApiAddress() {
    // Pega o CEP da variável global ou dos cookies
    const currentCep = cepDrawer.value || getCepFromCookies();

    if (!currentCep || currentCep.length < 8 || currentCep?.includes("**")) {
      return;
    }

    // Formata o CEP para garantir que esteja no formato correto
    const cepFormatted = formatCep(currentCep);

    // Se o CEP já está Formatted corretamente e tem 9 caracteres (12345-678)
    if (cepFormatted.length === 9 && cepFormatted.charAt(5) === "-") {
      isLoading.value = true;
      error.value = null;

      try {
        // Atualiza o valor no input
        // if (inputRef.current && (!inputRef.current.value || inputRef.current.value !== cepFormatted)) {
        //   inputRef.current.value = cepFormatted;
        // }

        // Atualiza o valor no estado global se necessário
        if (cepDrawer.value !== cepFormatted) {
          cepDrawer.value = cepFormatted;
        }

        // Busca os dados do endereço através do loader
        const result = await invoke.site.loaders.CepValidator({
          cep: cepFormatted,
        });

        if (result.isValid && result.data) {
          adressApi.value = result.data;

          const userHasAddressWithThisZipCode = userAddresses.value.some(
            (adress) => formatCep(adress.cep) === cepFormatted,
          );

          if (userHasAddressWithThisZipCode) {
            visibleApiAddress.value = false;

            if (typeSelected.value === null) {
              const addressFound = userAddresses.value.find(
                (adress) => formatCep(adress.cep) === cepFormatted,
              );

              if (addressFound) {
                typeSelected.value = "usuario";
                selectedAddressId.value = addressFound.id;
              }
            }
          } else {
            visibleApiAddress.value = true;

            if (typeSelected.value === null) {
              typeSelected.value = "api";
            }
          }
        }
      } catch (e) {
        console.error("Erro ao carregar endereço inicial:", e);
      } finally {
        isLoading.value = false;
      }
    }
  }

  // Efeito para carregar o endereço e dados do usuário quando o drawer é aberto
  useEffect(() => {
    if (displayCepDrawer.value) {
      // DEFINE O VALOR INICIAL DO INPUT E VALIDA
      if (inputRef.current) {
        const cepInicial = cepDrawer.value || getCepFromCookies() || "";
        inputRef.current.value = cepInicial;

        // Se tem CEP inicial, valida ele para definir o estado correto
        if (cepInicial && cepInicial.length === 9) {
          validateCep();
        }
      }

      loadInitialApiAddress();
      loadUserData();

      const checkCorrespondenceZipCode = () => {
        if (typeSelected.value !== null) return;

        const currentCep = cepDrawer.value || getCepFromCookies() || "";

        if (currentCep && userAddresses.value.length > 0) {
          const addressFound = userAddresses.value.find(
            (adress) => formatCep(adress.cep) === currentCep,
          );

          if (addressFound) {
            typeSelected.value = "usuario";
            selectedAddressId.value = addressFound.id;
          } else if (visibleApiAddress.value) {
            typeSelected.value = "api";
            selectedAddressId.value = null;
          }
        }
      };

      setTimeout(checkCorrespondenceZipCode, 300);
    }
  }, [displayCepDrawer.value]);

  async function validateCep() {
    if (!inputRef.current) return;

    const cepValue = inputRef.current.value;

    // Verifica se tem o formato básico completo antes de validar na API
    if (cepValue.length !== 9 || cepValue.charAt(5) !== "-") {
      error.value = "Formato de CEP inválido. Use: 12345-678";
      showErrorBorder();

      // Esconde o endereço da API se o formato estiver inválido
      visibleApiAddress.value = false;
      return false;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const result = await invoke.site.loaders.CepValidator({
        cep: cepValue,
      });

      if (!result.isValid) {
        error.value = result.message;
        showErrorBorder();

        // Esconde o endereço da API se for inválido
        visibleApiAddress.value = false;

        return false;
      }

      // CEP válido, armazenar dados do endereço da API
      adressApi.value = result.data ?? null;

      const userHasAddressWithThisZipCode = userAddresses.value.some(
        (adress) => formatCep(adress.cep) === cepValue,
      );

      if (userHasAddressWithThisZipCode) {
        visibleApiAddress.value = false;

        if (typeSelected.value === null) {
          const addressFound = userAddresses.value.find(
            (adress) => formatCep(adress.cep) === cepValue,
          );

          if (addressFound) {
            typeSelected.value = "usuario";
            selectedAddressId.value = addressFound.id;
          }
        }
      } else {
        visibleApiAddress.value = true;

        if (typeSelected.value === null) {
          typeSelected.value = "api";
          selectedAddressId.value = null;
        }
      }

      return true;
    } catch (e) {
      console.error("Erro ao validar CEP:", e);
      error.value = "Erro ao validar o CEP. Tente novamente mais tarde.";
      showErrorBorder();

      // Esconde o endereço da API em caso de erro
      visibleApiAddress.value = false;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function onSubmit() {
    // Se já houver um endereço selecionado (seja da API ou do usuário),
    // apenas salva o CEP atual e fecha o drawer
    if (typeSelected.value) {
      // Salva o CEP atual apenas se for válido
      if (inputRef.current) {
        // Verifica se o endereço da API está visível (significa que o CEP foi validado)
        if (typeSelected.value === "api" && visibleApiAddress.value) {
          setCepCookie(inputRef.current.value);
          cepDrawer.value = inputRef.current.value;
          displayCepDrawer.value = false;
        } else if (typeSelected.value === "usuario") {
          // Para endereços do usuário, pode salvar normalmente
          setCepCookie(inputRef.current.value);
          cepDrawer.value = inputRef.current.value;
          displayCepDrawer.value = false;
        } else {
          // Se não há endereço válido, tenta validar primeiro
          const cepValido = await validateCep();
          if (cepValido) {
            displayCepDrawer.value = false;
          }
        }
      }
      return;
    }

    // Caso contrário, tenta validar o CEP
    const cepValido = await validateCep();

    if (cepValido && inputRef.current) {
      // CEP válido, fechar o drawer (o CEP já foi salvo na função validateCep)
      displayCepDrawer.value = false;
    }
  }

  // Função para mostrar borda de erro no input
  function showErrorBorder() {
    if (inputRef.current) {
      inputRef.current.classList.add("border-red-500");
    }
  }

  // Função para lidar com a mudança no input
  function handleInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const formattedCep = formatCep(input.value);

    // Atualiza o valor do input com o CEP Formatted
    input.value = formattedCep;

    if (formattedCep.length === 9) {
      const userHasAddressWithThisZipCode = userAddresses.value.some(
        (adress) => formatCep(adress.cep) === formattedCep,
      );

      // Se o usuário NÃO tem endereço com esse CEP E há uma seleção ativa, limpa a seleção
      if (!userHasAddressWithThisZipCode && typeSelected.value !== null) {
        typeSelected.value = null;
        selectedAddressId.value = null;
      }
    }

    // Remove o estado de erro enquanto o usuário digita
    if (error.value) {
      error.value = null;
      if (inputRef.current) {
        inputRef.current.classList.remove("border-red-500");
      }
    }

    // Se o CEP estiver completo, valida automaticamente
    if (formattedCep.length === 9) {
      validateCep();
    } else {
      // Se o CEP não estiver completo, esconde o endereço da API
      visibleApiAddress.value = false;
    }
  }

  // Função para obter o nome completo do estado a partir da sigla
  function getNomeEstado(sigla: string): string {
    return estadosPorSigla[sigla] || sigla;
  }

  // Função para formatar o endereço da API no padrão desejado
  function formatApiAddress(adress: adressData): string {
    const rua = adress.logradouro || "Rua não informada";
    const bairro = adress.bairro || "Bairro não informado";
    const cidade = adress.localidade;
    const estado = getNomeEstado(adress.uf);
    const cep = adress.cep;

    return `${rua}, S/N - ${bairro}, ${cidade} - ${estado}. CEP ${cep}`;
  }

  // Função para formatar o endereço do usuário
  function formatUserAddress(adress: UserAddress): string {
    const rua = adress.street || adress.address || "Rua não informada";
    const numero = adress.addressNumber || "S/N";
    const complemento = adress.addressDetails || adress.address2 || "";
    const bairro = adress.neighborhood || "Bairro não informado";
    const cidade = adress.city || "";
    const estado = getNomeEstado(adress.state) || adress.state;
    const cep = adress.cep;

    // Formata o endereço no padrão desejado
    let adressFormatted = `${rua}, ${numero}`;

    if (complemento) {
      adressFormatted += ` - ${complemento}`;
    }

    adressFormatted += `, ${bairro}, ${cidade} - ${estado}. CEP ${cep}`;

    return adressFormatted;
  }

  function limparEstados() {
    error.value = null;
    visibleApiAddress.value = false;
    typeSelected.value = null;
    selectedAddressId.value = null;
    if (inputRef.current) {
      inputRef.current.classList.remove("border-red-500");
    }
  }

  return (
    <div
      onClick={() => {
        limparEstados();
        displayCepDrawer.value = false;
      }}
      class={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        displayCepDrawer.value ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()} // Impede que o clique no drawer feche o overlay
        class={`fixed top-0 left-0 w-full max-w-[90%] lg:w-[400px] h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          displayCepDrawer.value ? "translate-x-0" : "-translate-x-full"
        }`}
        onTransitionEnd={() => {
          if (displayCepDrawer.value && inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <div class="flex justify-between w-full items-center border-b border-neutral pb-3 px-2">
          <p class="mt-4 text-lg font-medium">Defina sua localização</p>
          <button
            onClick={() => {
              limparEstados();
              displayCepDrawer.value = false;
            }}
            class="text-gray-600 hover:text-gray-900 flex items-center justify-center"
          >
            <Icon id="XMark" size={24} strokeWidth={2} />
          </button>
        </div>

        <p class="mt-2 text-sm text-accent-content px-4 py-4">
          Preços, ofertas e disponibilidade podem variar de acordo com a sua
          localização.
        </p>
        <form
          class="mt-4 px-4 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div class="mb-5">
            <label
              for="txtZipCodeSearch"
              class="block text-sm font-medium text-gray-700"
            >
              Informe seu CEP
            </label>
            <div class="flex mt-2">
              <input
                ref={inputRef}
                type="text"
                inputmode="numeric"
                placeholder="00000-000"
                class="flex-1 py-2 px-3 border rounded-l-md outline-none focus:border-primary"
                maxLength={9}
                name="ZipCode"
                // value={cepDrawer.value}
                onInput={handleInputChange}
                disabled={isLoading.value}
              />
              <button
                id="btnSearch"
                type="submit"
                class="px-3 py-2 bg-primary text-white rounded-r-md outline-none hover:bg-accent duration-300 flex items-center justify-center"
                disabled={isLoading.value ||
                  error.value !== null || // NOVO: desabilita se houver erro
                  (!typeSelected.value && !visibleApiAddress.value)}
              >
                {isLoading.value
                  ? (
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
                    </div>
                  )
                  : <Icon id="search" size={20} />}
              </button>
            </div>

            {error.value && (
              <div class="text-red-500 text-sm mt-1">{error.value}</div>
            )}
          </div>
        </form>

        {/* Área de exibição de endereços */}
        <div class="px-4">
          {/* Título "Enviar para:" só aparece se tiver pelo menos um endereço para mostrar */}
          {(visibleApiAddress.value || userAddresses.value.length > 0) && (
            <p class="text-sm pb-6 font-medium">
              Enviar para: {inputRef.current?.value || cepDrawer.value || ""}
            </p>
          )}

          {/* Exibição do endereço encontrado via API */}
          {visibleApiAddress.value && adressApi.value && (
            <div
              class="py-4 border-b bg-white cursor-pointer"
              onClick={() => selectAdressApi()}
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div
                    class={`w-4 h-4 rounded-full relative ${
                      typeSelected.value === "api"
                        ? "bg-primary"
                        : "bg-gray-300"
                    }`}
                  >
                    {typeSelected.value === "api" && (
                      <div class="w-2 h-2 bg-white rounded-full absolute top-1 left-1">
                      </div>
                    )}
                  </div>
                </div>
                <div class="ml-3">
                  <p class="font-medium text-gray-900">{adressApi.value.cep}</p>
                  <p class="text-gray-600 text-sm mt-1">
                    {formatApiAddress(adressApi.value)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Seção de endereços do usuário */}
          {userAddresses.value.length > 0 && (
            <>
              {userAddresses.value.map((address) => (
                <div class="flex flex-col py-4 border-b ">
                  <div
                    key={address.id}
                    class={`cursor-pointer ${
                      address.cep.includes("**") ? "pointer-events-none" : ""
                    }`}
                    onClick={() => selectUserAddress(address)}
                  >
                    <div class="flex items-start">
                      <div class="flex-shrink-0 mt-1">
                        <div
                          class={`w-4 h-4 rounded-full relative ${
                            typeSelected.value === "usuario" &&
                              address.id === selectedAddressId.value
                              ? "bg-primary"
                              : "bg-gray-300"
                          } ${
                            address.cep.includes("**")
                              ? "pointer-events-none"
                              : ""
                          }`}
                        >
                          {typeSelected.value === "usuario" &&
                            address.id === selectedAddressId.value && (
                            <div class="w-2 h-2 bg-white rounded-full absolute top-1 left-1">
                            </div>
                          )}
                        </div>
                      </div>
                      <div class="ml-3">
                        <p class="font-medium text-gray-900">
                          {address.name || address.receiverName}
                        </p>
                        <p class="text-gray-600 text-sm mt-1">
                          {formatUserAddress(address)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {address.cep.includes("**") && (
                    <p class="text-sm bg-slate-100 rounded px-2 py-1 mt-2">
                      <span class="text-red-600">Atenção:</span>{" "}
                      Para selecionar este endereço, é necessário fazer o{" "}
                      <a
                        href="/login/authenticate"
                        class="text-primary hover:text-black text-sm mt-1 pointer-events-auto underline"
                      >
                        Login autenticado.
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          {isLoadingUser.value && (
            <div class="flex justify-center items-center py-4">
              <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin">
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DrawerCep;
