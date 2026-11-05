"use client";

import { useState } from "react";

interface Props {
  src: string | null;
  alt: string;
  className: string;
}

export function CollectionImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={className} role="img" aria-label={alt}>Aucune affiche</div>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
