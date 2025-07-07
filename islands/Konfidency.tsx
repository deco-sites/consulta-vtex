interface Props {
  productId: number;
}
function Konfidency({ productId }: Props) {
  return (
    <div class="w-full max-w-[1366px] px-4 lg:px-10 flex flex-col gap-6 mx-auto">
      <script
        dangerouslySetInnerHTML={{
          __html: `
      document.addEventListener('DOMContentLoaded', function() {
        var s = document.createElement('script');
        s.src = 'https://reviews.konfidency.com.br/consultaremedios/loader.js';
        document.body.appendChild(s);
      });
    `,
        }}
      />
      <div class="konfidency-reviews-details"></div>
    </div>
  );
}

export default Konfidency;
