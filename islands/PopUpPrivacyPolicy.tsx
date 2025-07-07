import { useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { useSignal } from "@preact/signals";

function PopUpPrivacyPolicy({ children }: { children: ComponentChildren }) {
  const showPopup = useSignal(false);

  useEffect(() => {
    const hasShownPopup = localStorage.getItem("hasShownPopupPolicy");
    const shouldShowPopup = !hasShownPopup || hasShownPopup === "false";

    if (shouldShowPopup) {
      showPopup.value = true;
    }
  }, []);

  function closePopup() {
    showPopup.value = false;
    localStorage.setItem("hasShownPopupPolicy", "true");
  }

  return (
    <>
      {showPopup.value && (
        <div class="fixed w-[100vw] max-h-[90%] z-30 bottom-0 bg-white py-[21px] px-4 lg:px-3 flex justify-around items-center border-t-[2px] border-[#dee2e6] flex-col lg:flex-row">
          {children}
          <button
            onClick={closePopup}
            class="py-[6px] px-2 border-[1px] border-[#009999] rounded-md text-[#009999] hover:text-white bg-white hover:bg-[#009999] text-sm flex items-center justify-center lg:min-w-[170px] transition-transform duration-300 hover:scale-[0.98] mt-4 lg:mt-0"
          >
            Entendi e concordo
          </button>
        </div>
      )}
    </>
  );
}

export default PopUpPrivacyPolicy;
