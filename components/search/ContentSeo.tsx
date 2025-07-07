interface Props {
  contentSeo: string;
}

function ContenteSeo({ contentSeo }: Props) {
  return (
    <section id="bula" class="content-seo">
      <div dangerouslySetInnerHTML={{ __html: contentSeo }}></div>
    </section>
  );
}

export default ContenteSeo;
