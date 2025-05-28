"use client";
import { Blog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

const BlogItem = ({ blog }: { blog: Blog }) => {
  const { mainImage, title, metadata, slug } = blog;

  return (
    <div className="animate_top rounded-lg bg-white p-4 pb-9 shadow-solid-8 dark:bg-blacksection">
      <Link href={`/blog/${slug || ''}`} className="relative block aspect-[368/239]">
        <Image 
          src={mainImage} 
          alt={title} 
          fill 
          className="rounded-lg object-cover"
        />
      </Link>

      <div className="px-4">
        <h3 className="mb-3.5 mt-7.5 line-clamp-2 inline-block text-lg font-medium text-black duration-300 hover:text-primary dark:text-white dark:hover:text-primary xl:text-itemtitle2">
          <Link href={`/blog/${slug || ''}`}>
            {title.length > 40 ? `${title.slice(0, 40)}...` : title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-base text-body-color dark:text-body-color-dark">
          {metadata}
        </p>
      </div>
    </div>
  );
};

export default BlogItem;