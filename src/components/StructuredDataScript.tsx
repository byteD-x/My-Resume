interface StructuredDataScriptProps {
  data: object;
}

export function StructuredDataScript({
  data,
}: StructuredDataScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
