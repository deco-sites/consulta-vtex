function TitleH1({ title }: { title: string }) {
  return (
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      <span class="hidden">{title}</span>
    </h1>
  );
}

export default TitleH1;
