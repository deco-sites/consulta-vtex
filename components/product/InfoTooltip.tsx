// InfoTooltip.tsx
interface InfoTooltipProps {
  text: string; // Texto do tooltip
}

function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <div
      class="relative inline-flex items-center ml-2 group"
      role="tooltip"
      aria-label={text}
    >
      <img
        class="cursor-pointer"
        src="https://assets.decocache.com/consul-remedio/fa81b361-77fb-44ef-a58c-045973b5a98d/icon-wrapper.svg"
        alt="Ajuda"
        width={14}
        height={14}
      />
      <span class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs font-normal rounded shadow-lg pointer-events-none -top-2 left-full ml-2">
        {text}
        <span class="absolute -left-1 top-3 w-0 h-0 border-t-4 border-r-4 border-b-4 border-t-transparent border-r-gray-800 border-b-transparent">
        </span>
      </span>
    </div>
  );
}

export default InfoTooltip;
