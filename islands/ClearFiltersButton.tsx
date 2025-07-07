interface ClearFiltersButtonProps {
  className?: string;
  label?: string;
}

const ClearFiltersButton = ({
  className = "",
  label = "Limpar filtros",
}: ClearFiltersButtonProps) => {
  const handleClearFilters = () => {
    const url = new URL(location.href);
    // Remove everything after the "?" by only keeping the origin and pathname
    const cleanUrl = url.origin + url.pathname;
    history.pushState({}, "", cleanUrl);
    location.reload(); // Reloads to apply the change
  };

  return (
    <button
      className={`bg-[#099] text-white px-4 py-2 rounded-md font-medium inline-block 
                   hover:bg-teal-600 hover:border-teal-600
                   focus:ring-4 focus:ring-teal-300/50
                   active:bg-teal-700 active:border-teal-700 active:shadow-inner
                   disabled:opacity-65 disabled:bg-teal-500/65 disabled:text-white/65 disabled:border-teal-500/65
                   transition-colors duration-150 ease-in-out ${className}`}
      onClick={handleClearFilters}
    >
      {label}
    </button>
  );
};

export default ClearFiltersButton;
