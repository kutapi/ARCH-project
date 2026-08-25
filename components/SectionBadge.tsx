export default function SectionBadge({ title }: { title: string }) {
  return (
    <h1 className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
      {title}
    </h1>
  );
}
