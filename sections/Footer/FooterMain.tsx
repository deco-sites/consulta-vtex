import { HTMLWidget, type ImageWidget } from "apps/admin/widgets.ts";
import ScrollToTop from "deco-sites/consul-remedio/islands/ScrollToTop.tsx";

/** @titleBy title */
interface Item {
  title: string;
  href?: string;
}

/** @titleBy title */
interface Link extends Item {
  children: Item[];
}

/** @titleBy alt */
interface Social {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

/** @titleBy text */
interface FooterPaymentAndBuyDiv {
  text: string;
  image: Social[];
  href?: string;
}

interface ImageAppStores {
  href?: string;
  image: ImageWidget;
}
interface Props {
  institucionals?: Link[];
  otherSites: Link[];
  imageAppStores: ImageAppStores[];
  services: Link[];
  emphasis: Link[];
  everythingAToZ: Link[];
  costumerService: Link[];
  myAccount: Link[];
  termsAndPolicies: Link[];
  socialMedias: Link[];
  linksFooter: Link[];
  textAnvisa: string;
  logoAnvisa: ImageWidget;
  textFooterTwo: HTMLWidget;
  divFooter: FooterPaymentAndBuyDiv[];
  footerCopyright: HTMLWidget;
}

function Footer({
  institucionals,
  otherSites,
  imageAppStores,
  services,
  emphasis,
  everythingAToZ,
  costumerService,
  myAccount,
  termsAndPolicies,
  socialMedias,
  linksFooter,
  textAnvisa,
  logoAnvisa,
  textFooterTwo,
  divFooter,
  footerCopyright,
}: Props) {
  return (
    <footer class=" mt-5 sm:mt-10">
      <details open class="details-footer flex group flex-col footer-details">
        <summary
          style={{ backgroundColor: "#f8f9fa" }}
          class="cursor-pointer mx-auto marker:hidden list-none appearance-none w-fit rounded-t-[4px] px-3 py-2"
        >
          <div class="flex items-center gap-2 text-info">
            <span class="minus hidden">Menos</span>
            <span class="more hidden">Mais</span> informações
            <svg
              class="group-open:rotate-180 transition-[0.5s]"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.64565 4.64494C7.6921 4.59838 7.74728 4.56143 7.80802 4.53623C7.86877 4.51102 7.93389 4.49805 7.99965 4.49805C8.06542 4.49805 8.13054 4.51102 8.19129 4.53623C8.25203 4.56143 8.30721 4.59838 8.35365 4.64494L14.3537 10.6449C14.4475 10.7388 14.5003 10.8662 14.5003 10.9989C14.5003 11.1317 14.4475 11.2591 14.3537 11.3529C14.2598 11.4468 14.1324 11.4996 13.9997 11.4996C13.8669 11.4996 13.7395 11.4468 13.6457 11.3529L7.99965 5.70594L2.35366 11.3529C2.25977 11.4468 2.13243 11.4996 1.99966 11.4996C1.86688 11.4996 1.73954 11.4468 1.64566 11.3529C1.55177 11.2591 1.49902 11.1317 1.49902 10.9989C1.49902 10.8662 1.55177 10.7388 1.64566 10.6449L7.64565 4.64494Z"
                fill="black"
              />
            </svg>
          </div>
        </summary>
        <div
          class="w-full flex flex-col lg:flex-row gap-6 lg:justify-between px-3 pt-6 pb-4"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div class="lg:flex lg:flex-col lg:gap-6">
            {institucionals?.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                {href
                  ? (
                    <a class="text-sm font-semibold text-info" href={href}>
                      {title}
                    </a>
                  )
                  : <p class="text-sm font-semibold text-info">{title}</p>}

                <div class="flex flex-col gap-2">
                  {children?.map(({ title, href }) => (
                    <div>
                      <a class="text-sm text-info hover:underline" href={href}>
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div class="hidden lg:flex lg:flex-col">
              {otherSites?.map(({ title, href, children }) => (
                <div class="flex flex-col gap-4">
                  {href
                    ? (
                      <a
                        class="text-sm font-semibold text-info"
                        href={href}
                        target="_blank"
                      >
                        {title}
                      </a>
                    )
                    : <p class="text-sm font-semibold text-info">{title}</p>}
                  <div class="flex flex-col gap-2">
                    {children?.map(({ title, href }) => (
                      <div>
                        <a
                          class="text-sm text-info hover:underline"
                          href={href}
                          target="_blank"
                        >
                          {title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div class="flex mt-4 gap-2">
                {imageAppStores.map(({ href, image }) => (
                  <a href={href} target="_blank">
                    <img
                      class="w-[100px] h-auto"
                      src={image}
                      alt="app store"
                      loading={"lazy"}
                      width={100}
                      height={31}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div class="lg:hidden">
            {otherSites?.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                {href
                  ? (
                    <a
                      class="text-sm font-semibold text-info"
                      href={href}
                      target="_blank"
                    >
                      {title}
                    </a>
                  )
                  : <p class="text-sm font-semibold text-info">{title}</p>}
                <div class="flex flex-col gap-2">
                  {children?.map(({ title, href }) => (
                    <div>
                      <a
                        class="text-sm text-info hover:underline"
                        href={href}
                        target="_blank"
                      >
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div class="flex mt-4 gap-2">
              {imageAppStores.map(({ image, href }) => (
                <a href={href} target="_blank">
                  <img
                    class="w-[100px] h-auto"
                    src={image}
                    alt="app store"
                    loading={"lazy"}
                    width={100}
                    height={31}
                  />
                </a>
              ))}
            </div>
          </div>
          <div class="lg:flex lg:flex-col gap-6">
            {services?.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                {href
                  ? (
                    <a
                      class="text-sm font-semibold text-info"
                      href={href}
                      target="_blank"
                    >
                      {title}
                    </a>
                  )
                  : <p class="text-sm font-semibold text-info">{title}</p>}
                <div class="flex flex-col gap-2">
                  {children?.map(({ title, href }) => (
                    <div>
                      <a
                        class="text-sm text-info hover:underline"
                        href={href}
                        target="_blank"
                      >
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div class="hidden lg:flex flex-col">
              {emphasis?.map(({ title, href, children }) => (
                <div class="flex flex-col gap-4">
                  {href
                    ? (
                      <a class="text-sm font-semibold text-info" href={href}>
                        {title}
                      </a>
                    )
                    : <p class="text-sm font-semibold text-info">{title}</p>}
                  <div class="flex flex-col gap-2">
                    {children?.map(({ title, href }) => (
                      <div>
                        <a
                          class="text-sm text-info hover:underline"
                          href={href}
                        >
                          {title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="lg:hidden">
            {emphasis?.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                {href
                  ? (
                    <a class="text-sm font-semibold text-info" href={href}>
                      {title}
                    </a>
                  )
                  : <p class="text-sm font-semibold text-info">{title}</p>}
                <div class="flex flex-col gap-2">
                  {children?.map(({ title, href }) => (
                    <div>
                      <a class="text-sm text-info hover:underline" href={href}>
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div class="flex gap-4 justify-between">
            {everythingAToZ?.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                {href
                  ? (
                    <a class="text-sm font-semibold text-info" href={href}>
                      {title}
                    </a>
                  )
                  : <p class="text-sm font-semibold text-info">{title}</p>}
                <div class="flex flex-col gap-2">
                  {children?.map(({ title, href }) => (
                    <div>
                      <a class="text-sm text-info hover:underline" href={href}>
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div class="lg:hidden">
              {costumerService?.map(({ title, href, children }) => (
                <div class="flex flex-col gap-4">
                  {href
                    ? (
                      <a
                        class="text-sm font-semibold text-info"
                        href={href}
                        target="_blank"
                      >
                        {title}
                      </a>
                    )
                    : <p class="text-sm font-semibold text-info">{title}</p>}
                  <div class="flex flex-col gap-2">
                    {children?.map(({ title, href }) => (
                      <div>
                        <a
                          class="text-sm text-info hover:underline"
                          href={href}
                          target="_blank"
                        >
                          {title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="hidden lg:flex">
            {costumerService?.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                {href
                  ? (
                    <a
                      class="text-sm font-semibold text-info"
                      href={href}
                      target="_blank"
                    >
                      {title}
                    </a>
                  )
                  : <p class="text-sm font-semibold text-info">{title}</p>}
                <div class="flex flex-col gap-2">
                  {children?.map(({ title, href }) => (
                    <div>
                      <a
                        class="text-sm text-info hover:underline"
                        href={href}
                        target="_blank"
                      >
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div class="flex gap-4 justify-between lg:justify-normal lg:flex-col">
            <div class="flex flex-col gap-6">
              {myAccount?.map(({ title, href, children }) => (
                <div class="flex flex-col gap-4">
                  {href
                    ? (
                      <a class="text-sm font-semibold text-info" href={href}>
                        {title}
                      </a>
                    )
                    : <p class="text-sm font-semibold text-info">{title}</p>}
                  <div class="flex flex-col gap-2">
                    {children?.map(({ title, href }) => (
                      <div>
                        <a
                          class="text-sm text-info hover:underline"
                          href={href}
                        >
                          {title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div class="lg:hidden">
                {termsAndPolicies?.map(({ title, href, children }) => (
                  <div class="flex flex-col gap-4">
                    {href
                      ? (
                        <a class="text-sm font-semibold text-info" href={href}>
                          {title}
                        </a>
                      )
                      : <p class="text-sm font-semibold text-info">{title}</p>}
                    <div class="flex flex-col gap-2">
                      {children?.map(({ title, href }) => (
                        <div>
                          <a
                            class="text-sm text-info hover:underline"
                            href={href}
                          >
                            {title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div class="lg:hidden">
              {socialMedias?.map(({ title, href, children }) => (
                <div class="flex flex-col gap-4">
                  {href
                    ? (
                      <a
                        class="text-sm font-semibold text-info"
                        href={href}
                        target="_blank"
                      >
                        {title}
                      </a>
                    )
                    : <p class="text-sm font-semibold text-info">{title}</p>}
                  <div class="flex flex-col gap-2">
                    {children?.map(({ title, href }) => (
                      <div>
                        <a
                          class="text-sm text-info hover:underline"
                          href={href}
                          target="_blank"
                        >
                          {title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div class="hidden lg:flex">
              {termsAndPolicies?.map(({ title, href, children }) => (
                <div class="flex flex-col gap-4">
                  {href
                    ? (
                      <a class="text-sm font-semibold text-info" href={href}>
                        {title}
                      </a>
                    )
                    : <p class="text-sm font-semibold text-info">{title}</p>}
                  <div class="flex flex-col gap-2">
                    {children?.map(({ title, href }) => (
                      <div>
                        <a
                          class="text-sm text-info hover:underline"
                          href={href}
                        >
                          {title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="hidden lg:flex">
            {socialMedias?.map(({ title, href, children }) => (
              <div class="flex flex-col gap-4">
                {href
                  ? (
                    <a class="text-sm font-semibold text-info" href={href}>
                      {title}
                    </a>
                  )
                  : <p class="text-sm font-semibold text-info">{title}</p>}
                <div class="flex flex-col gap-2">
                  {children?.map(({ title, href }) => (
                    <div>
                      <a class="text-sm text-info hover:underline" href={href}>
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
      <div class="px-3 pt-4" style={{ backgroundColor: "#f8f9fa" }}>
        <div class="flex gap-x-4 gap-y-2  flex-wrap text-info">
          {linksFooter?.map(({ title, href }) => (
            <div>
              <a class="text-base" href={href}>
                {title}
              </a>
            </div>
          ))}
        </div>

        <div class="lg:flex lg:flex-row lg:mt-4 lg:gap-16 pb-4 border-b border-[#DEE2E6] mb-4">
          <div class="">
            <p class="text-[#6C757D] mt-4 mb-2 lg:mb-4 lg:mt-0">{textAnvisa}</p>
            <img
              class="max-w-[247px] h-auto mb-6 lg:h-fit"
              src={logoAnvisa}
              alt="logo anvisa"
              loading={"lazy"}
              width={250}
              height={60}
            />
          </div>
          <div
            contentEditable="true"
            dangerouslySetInnerHTML={{ __html: `${textFooterTwo}` }}
            class="text-[#6C757D] text-sm leading-[21px]"
          >
          </div>
        </div>
        <div class="flex flex-col gap-4 lg:flex-row lg:gap-10 mb-3 lg:mb-4">
          {divFooter?.map(({ text, image }) => (
            <div>
              <p class="text-sm text-[#6C757D] mb-1">{text}</p>
              <div class="flex gap-2">
                {image.map(({ image, alt, href }) =>
                  href
                    ? (
                      <a
                        aria-label={"link footer"}
                        target={"_blank"}
                        href={href}
                      >
                        <img
                          src={image}
                          alt={alt ?? "payment methods"}
                          loading={"lazy"}
                          width={text == "Formas de pagamento aceitas:"
                            ? 30
                            : 100}
                          height={30}
                        />
                      </a>
                    )
                    : (
                      <img
                        src={image}
                        alt={alt ?? "payment methods"}
                        loading={"lazy"}
                        width={text == "Formas de pagamento aceitas:"
                          ? 30
                          : 100}
                        height={30}
                      />
                    )
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          contentEditable="true"
          dangerouslySetInnerHTML={{ __html: `${footerCopyright}` }}
          class="text-[#6C757D] text-sm mt-[10px] pb-2"
        >
        </div>
      </div>
      <ScrollToTop />
    </footer>
  );
}

export function LoadingFallback() {
  return <div>loading...</div>;
}

export default Footer;
