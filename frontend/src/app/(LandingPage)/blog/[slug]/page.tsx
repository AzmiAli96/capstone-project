// app/(LandingPage)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import BlogData from "@/components/blog/blogData";
import Image from "next/image";
import { Metadata } from "next";
import { Blog } from "@/types/blog";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const slug = params.slug; // still sync, fine for local usage
    const blog = BlogData.find((b) => b.slug === slug);

    return {
        title: blog?.title || "Blog Tidak Ditemukan",
        description: blog?.metadata || "Blog detail page",
    };
}

const BlogDetailPage = ({ params }: { params: { slug: string } }) => {
    const blog: Blog | undefined = BlogData.find((item) => item.slug === params.slug);

    if (!blog) return notFound();

    const categories = Array.from(new Set(BlogData.flatMap(blog => blog.tags || [])));

    // Ambil satu blog dari setiap kategori (untuk membuat link ke /blog/[slug])
    const categoryLinks = categories.map((cat) => {
        const blogWithCategory = BlogData.find((b) => b.tags?.includes(cat));
        return {
            name: cat,
            slug: blogWithCategory?.slug || "#",
        };
    });

    return (
        <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
            <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
                <div className="flex flex-col-reverse gap-7.5 lg:flex-row xl:gap-12.5">
                    <div className="md:w-1/2 lg:w-[25%]">
                        <div className="animate_top mb-10 rounded-md border border-stroke bg-white p-9 shadow-solid-13 dark:border-strokedark dark:bg-blacksection">
                            <h4 className="mb-7.5 text-2xl font-semibold text-black dark:text-white">
                                Categories
                            </h4>

                            <ul>
                                {categoryLinks.map((category) => (
                                    <li
                                        key={category.name}
                                        className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary"
                                    >
                                        <Link href={`/blog/${category.slug}`}>
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:w-2/3">
                        <div className="animate_top rounded-md border border-stroke bg-white p-7.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection md:p-10">
                            {blog.mainImage && (
                                <div className="mb-10 w-full overflow-hidden ">
                                    <div className="relative aspect-97/60 w-full sm:aspect-97/44">
                                        <Image
                                            src={blog.mainImage}
                                            alt={blog.title}
                                            fill
                                            className="rounded-md object-cover object-center"
                                        />
                                    </div>
                                </div>
                            )}

                            <h2 className="mb-5 mt-11 text-3xl font-semibold text-black dark:text-white">
                                {blog.title}
                            </h2>

                            <ul className="mb-9 flex flex-wrap gap-5">
                                {blog.author && (
                                    <li>
                                        <span className="text-black dark:text-white">Author: </span>{blog.author.name}
                                    </li>
                                )}
                                {blog.publishedAt && (
                                    <li>
                                        <span className="text-black dark:text-white">Published On: </span>{blog.publishedAt}
                                    </li>
                                )}
                                {blog.tags && blog.tags.length > 0 && (
                                    <li>
                                        <span className="text-black dark:text-white">Category: </span>{blog.tags.join(", ")}
                                    </li>
                                )}
                            </ul>

                            <div
                                className="blog-details prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: blog.body || "" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetailPage;
