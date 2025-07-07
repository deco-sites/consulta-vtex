interface Props {
  contentSeo: string;
}

function ContentFactory({ contentSeo }: Props) {
  return (
    <section class="content-seo">
      <div dangerouslySetInnerHTML={{ __html: contentSeo }}></div>
    </section>
  );
}

export default ContentFactory;
