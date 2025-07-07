export interface content {
  /** @format html */
  text: string;
}

function content({
  text,
}: content) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}

export function LoadingFallback() {
  return <div>loading...</div>;
}
export default content;
