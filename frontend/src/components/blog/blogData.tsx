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
      name: "Azmi Ali",
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
    metadata: "Blog ini menjelaskan cara kerja layanan secara ringkas dan jelas, membantu pembaca memahami proses di baliknya dengan mudah.",
    tags: ["Cara Kerja Website"],
    publishedAt: "02-06-2025",
    author: {
      name: "Azmi Ali",
      image: "/images/author.jpg"
    },
    body: `
    <p>Dalam blog ini, kami akan menjelaskan secara detail bagaimana cara menggunakan layanan pengiriman kami mulai dari awal hingga 
      barang Anda sampai ke tujuan. Untuk memudahkan pemahaman, kami juga menyertakan gambar pendukung pada setiap langkah. Berikut adalah 
      tahapan-tahapan yang perlu Anda ikuti:</p>

      <h4>Login atau Registrasi</h4>
      <p>Di halaman landing page, klik tombol Get Started untuk memulai proses. 
      Anda akan diarahkan ke halaman autentikasi, yaitu halaman login atau registrasi.
      Masukkan alamat email dan kata sandi yang sudah Anda daftarkan sebelumnya. Jika Anda belum memiliki akun, silakan lakukan registrasi 
      terlebih dahulu dengan mengisi data yang dibutuhkan agar dapat menggunakan layanan kami.</p>
      <div style="display: flex; gap: 12px; justify-content: center; margin: 16px 0;">
          <img src="/images/LoginPage.png" alt="Login" style="width: 48%; height: auto;" />
          <img src="/images/RegisterPage.png" alt="Register" style="width: 48%; height: auto;" />
      </div>
      <p></p>
      `
  },
  {
    _id: 3,
    slug: "daftar-harga",
    mainImage: "/images/blog/harga.jpg",
    title: "Daftar Harga",
    metadata: "Informasi lengkap seputar harga.",
    tags: ["Daftar Harga"],
    publishedAt: "2023-08-05",
    author: {
      name: "Jhon Doe",
      image: "/images/author.jpg"
    },
    body: `<p>Lihat semua daftar harga kami...</p>`
  },
];


export default BlogData;
