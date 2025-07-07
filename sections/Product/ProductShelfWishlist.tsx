export { default } from "../../components/product/ProductShelfWishlist.tsx";

export function LoadingFallback() {
  return (
    <div class="h-[300px] lg:h-[600px] flex justify-center flex-col px-4 lg:px-10 gap-6 py-4 lg:py-10 mx-auto max-w-[1366px]">
      <div class="hidden lg:grid grid-cols-4 gap-4 w-full max-w-[1366px] mx-auto">
        <div class="w-80 h-12 bg-gray-300 animate-pulse rounded-lg ml-"></div>
      </div>
      <div class="hidden lg:grid grid-cols-4 gap-4 w-full max-w-[1366px] mx-auto h-full">
        <div class="w-full max-h-[500px]  h-full bg-gray-300 animate-pulse rounded-lg">
        </div>
        <div class="w-full max-h-[500px] h-full bg-gray-300 animate-pulse rounded-lg">
        </div>
        <div class="w-full max-h-[500px] h-full bg-gray-300 animate-pulse rounded-lg">
        </div>
        <div class="w-full max-h-[500px] h-full bg-gray-300 animate-pulse rounded-lg">
        </div>
      </div>
      <div class="lg:hidden w-full max-h-[270px] max-w-sm mx-auto  h-full bg-gray-300 animate-pulse rounded-lg">
      </div>
    </div>
  );
}
