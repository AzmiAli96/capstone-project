import { Blog } from "@/types/blog";

const BlogData: Blog[] = [
  {
    _id: 1,
    slug: "tentang-layanan-kami",
    mainImage: "/images/blog/layanan-kami.jpg",
    title: "Tentang Layanan Kami",
    metadata: "Deskripsi singkat tentang layanan kami.",
    body: `
      <p>Lorem ipsum dolor sit amet...</p>
      <p>Curabitur vel turpis in dolor...</p>
    `,
    author: {
      name: "Jhon Doe",
      image: "/images/author.jpg"
    },
    tags: ["Tentang Layanan Kami"],
    publishedAt: "2023-07-30"
  },
  {
    _id: 2,
    slug: "cara-kerja",
    mainImage: "/images/blog/working.jpg",
    title: "Cara Kerja",
    metadata: "Lorem ipsum dolor sit amet, consectetur adipiscing elit convallis tortor.",
    tags: ["Cara Kerja Website"], // ✅ Tambahkan ini
    publishedAt: "2023-08-01",
    author: {
      name: "Jhon Doe",
      image: "/images/author.jpg"
    },
    body: `<p>Penjelasan cara kerja layanan kami...</p>`
  },
  {
    _id: 3,
    slug: "daftar-harga",
    mainImage: "/images/blog/harga.jpg",
    title: "Daftar Harga",
    metadata: "Informasi lengkap seputar harga.",
    tags: ["Daftar Harga"], // ✅ Tambahkan ini
    publishedAt: "2023-08-05",
    author: {
      name: "Jhon Doe",
      image: "/images/author.jpg"
    },
    body: `<p>Lihat semua daftar harga kami...</p>`
  },
];


export default BlogData;
