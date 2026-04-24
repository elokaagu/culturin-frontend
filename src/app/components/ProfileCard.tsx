import Image from "next/image";
import { Link } from "next-view-transitions";

import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../lib/imagePlaceholder";

export type ProfileCardArticle = {
  title: string;
  description: string;
  imageSrc: string | null | undefined;
  author: string;
  /** Optional tiny preview for `placeholder="blur"` (remote URLs need this). */
  blurDataURL?: string;
};

type ProfileCardProps = {
  article: ProfileCardArticle;
  /** When set, the entire card is keyboard-focusable and navigates here. */
  href?: string;
  className?: string;
};

const shellClass =
  "group flex w-full max-w-[min(100%,20rem)] flex-col rounded-xl outline-none transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/35 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

function CardMedia({ article }: { article: ProfileCardArticle }) {
  const src = resolveContentImageSrc(article.imageSrc);
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-white/10">
      <Image
        src={src}
        alt={article.title}
        fill
        loading="lazy"
        placeholder="blur"
        blurDataURL={article.blurDataURL ?? IMAGE_BLUR_DATA_URL}
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        sizes="(max-width: 640px) 45vw, 320px"
        unoptimized={isBundledPlaceholderSrc(src)}
      />
    </div>
  );
}

function CardCopy({ article }: { article: ProfileCardArticle }) {
  const author = article.author.trim();

  return (
    <div className="mt-3 flex flex-col gap-1.5">
      <h3 className="text-base font-semibold leading-snug text-white line-clamp-2">{article.title}</h3>
      <p className="text-sm leading-relaxed text-neutral-400 line-clamp-3">{article.description}</p>
      {author ? (
        <p className="text-xs font-medium tracking-wide text-neutral-500">By {author}</p>
      ) : null}
    </div>
  );
}

export default function ProfileCard({ article, href, className }: ProfileCardProps) {
  const merged = [shellClass, className].filter(Boolean).join(" ");

  if (href) {
    return (
      <Link href={href} className={`${merged} text-left no-underline`}>
        <article className="flex flex-col">
          <CardMedia article={article} />
          <CardCopy article={article} />
        </article>
      </Link>
    );
  }

  return (
    <article className={merged}>
      <CardMedia article={article} />
      <CardCopy article={article} />
    </article>
  );
}
