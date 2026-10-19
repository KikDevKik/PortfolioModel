import { imageUrl, srcSet } from '@/lib/cloudinary';

type Props = {
  id: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export default function Img({ id, alt, className, sizes = '100vw', priority, width, height }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl(id, { w: 1600 })}
      srcSet={srcSet(id)}
      sizes={sizes}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
}
