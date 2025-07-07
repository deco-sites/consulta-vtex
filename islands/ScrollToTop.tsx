import { useEffect, useState } from "preact/hooks"; // Importe 'useState' e 'useEffect' de preact/hooks

function ScrollToTop() {
  const [showButton, setShowButton] = useState(false); // Estado para controlar a visibilidade do botão

  // Efeito para monitorar o scroll
  useEffect(() => {
    const handleScroll = () => {
      if (globalThis.window.scrollY > 2000) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    globalThis.window.addEventListener("scroll", handleScroll);

    return () => {
      globalThis.window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    globalThis.window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!showButton) {
    return null;
  }

  return (
    <div
      onClick={scrollToTop}
      className="shadow bg-white hover:bg-[#ebebeb] transition-[0.5s] border rounded-full border-primary fixed right-5 lg:right-10 bottom-5 lg:bottom-10 p-4 flex justify-center items-center cursor-pointer"
    >
      <svg
        className="fill-primary rotate-90"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="14"
        viewBox="0 0 15 14"
        fill="none"
      >
        <path
          d="M7.01456 14L7.71845 13.3218L1.86893 7.48443H15V6.51557H1.86893L7.71845 0.6782L7.01456 0L0 7L7.01456 14Z"
          fill=""
        >
        </path>
      </svg>
    </div>
  );
}

export default ScrollToTop;
