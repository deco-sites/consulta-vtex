import PopUpPrivacyPolicyContainer from "../../islands/PopUpPrivacyPolicy.tsx";

export interface Props {
  text: string;
  href?: string;
  textHref?: string;
}

export default function PopUpPrivacyPolicy({ text, href, textHref }: Props) {
  return (
    <PopUpPrivacyPolicyContainer>
      <p class="text-sm text-black max-lg:text-center mx-3 lg:mx-0">
        {text}
        <a
          class="text-sm text-[#009999] underline ml-1"
          href="/politica-de-privacidade"
        >
          {textHref}
        </a>
      </p>
    </PopUpPrivacyPolicyContainer>
  );
}
