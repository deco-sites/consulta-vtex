export { default } from "../../components/search/NotFound.tsx";
export function LoadingFallback() {
  return (
    <div
      style={{ height: "600px" }}
      class="flex justify-center flex-col px-4 lg:px-10 gap-6 py-8 lg:py-10 mx-auto max-w-[1366px]"
    >
      <div class="w-full max-h-[500px] max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
    </div>
  );
}
