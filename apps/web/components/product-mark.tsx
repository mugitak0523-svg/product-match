import Image from "next/image";

export function ProductMark({ name, src, size = 52 }: { name: string; src?: string | null; size?: number }) {
  if (src) return <Image className="product-logo" src={src} alt={`${name} logo`} width={size} height={size} />;
  return <span className="product-logo fallback" style={{ width: size, height: size }}>{name.slice(0, 1).toUpperCase()}</span>;
}
