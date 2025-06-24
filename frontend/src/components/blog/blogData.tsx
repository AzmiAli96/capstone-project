import { Blog } from "@/types/blog";

const BlogData: Blog[] = [
  {
    _id: 1,
    slug: "tentang-layanan-kami",
    mainImage: "/images/blog/kartu.jpg",
    title: "Tentang Layanan Kami",
    metadata: "Deskripsi singkat tentang layanan kami.",
    body: `
      <p>Gemilang Cargo adalah mitra logistik terpercaya Anda, spesialis dalam pengiriman barang kargo dari 
      wilayah sekitar Jakarta menuju berbagai wilayah di Sumatera. Kami memahami betul dinamika kebutuhan 
      pengiriman di era modern, baik itu untuk keperluan personal maupun kebutuhan vital bisnis Anda. Dengan 
      pengalaman dan dedikasi, kami hadir untuk menjembatani jarak, memastikan setiap barang kiriman Anda sampai 
      ke tujuan dengan aman dan efisien.</p>
      <p>Dengan jaringan luas yang mencakup berbagai titik di Sumatera dan tim profesional yang berdedikasi, 
      Gemilang Cargo siap menjadi mitra pengiriman andalan Anda setiap saat. Kami selalu berusaha melampaui ekspektasi, 
      memberikan solusi logistik yang tidak hanya efisien tetapi juga memberikan ketenangan pikiran.</p>
      <p>Pilih Gemilang Cargo untuk kenyamanan, kecepatan, dan kepercayaan dalam setiap pengiriman Anda. 
      Biarkan kami yang mengurus logistik, agar Anda bisa fokus pada hal-hal yang lebih penting.</p>
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
      
      <h4>Order Pesanan</h4>
      <p>Setelah berhasil Login ke Dashboard, temukan menu Order. Klik di sana, lalu isi semua detail yang diperlukan dengan jelas dan teliti. 
      Kami ingin memastikan pesanan Anda tiba dengan sempurna di tangan Anda!</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; margin: 16px 0;">
        <img src="/images/dashboard.png" alt="dashboard" style="width: 100%; height: auto; border-radius: 8px;" />
        <img src="/images/orderForm.png" alt="order" style="width: 75%; height: auto; border-radius: 8px;" />
      </div>

      <h4>Pembayaran</h4>
      <p>Setelah berhasil membuat pesanan, silakan lanjutkan ke Halaman Pembayaran. Di sana, Anda akan menemukan instruksi pembayaran dan formulir
       untuk mengirimkan bukti pembayaran Anda. Pastikan untuk mengunggah bukti agar pesanan Anda bisa segera kami proses.</p>
       <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">

  <div style="display: flex; flex-direction: column; gap: 12px;">
    <img src="/images/tablepembayaran.png" alt="table pembayaran" style="width: 100%; height: auto; border-radius: 8px;" />
    <img src="/images/proses.png" alt="proses" style="width: 100%; height: auto; border-radius: 8px;" />
  </div>

  <div style="display: flex; align-items: center; justify-content: center;">
    <img src="/images/buktipembayaran.png" alt="bukti pembayaran" style="width: 80%; height: auto; border-radius: 8px;" />
  </div>
</div>
<p>Selesai! Pesanan Anda sedang dalam perjalanan menuju tujuan Anda. Kami akan segera memberitahukan Anda jika ada pembaruan status pengiriman.
Terima kasih telah memakai layanan kami</p>
      `
  },
  {
    _id: 3,
    slug: "daftar-harga",
    mainImage: "/images/blog/harga.jpg",
    title: "Daftar Harga",
    metadata: "Blog ini menjelaskan Harga yang digunakan dalam pembayaran, membantu pembaca memahami proses di baliknya dengan mudah.",
    tags: ["Daftar Harga"],
    publishedAt: "23-06-2025",
    author: {
      name: "Azmi Ali",
      image: "/images/author.jpg"
    },
    body: `<p>Kami ingin memastikan bahwa informasi harga kami transparan dan mudah dipahami, 
    jadi kami akan memberi Anda instruksi lengkap tentang daftar harga layanan kami. 
    Untuk membuatnya lebih mudah, kami juga menyertakan gambar pendukung di setiap langkah. Untuk mendapatkan informasi harga yang Anda butuhkan</p>
    <h3>Daftar Harga</h3> 
    <p>Kami melayani pengiriman ke berbagai provinsi dengan harga yang kompetitif. 
    Anda bisa melihat daftar provinsi tujuan beserta harga layanan kami pada tabel atau bagian berikut. 
    Kami memastikan transparansi penuh sehingga Anda bisa merencanakan kebutuhan pengiriman Anda dengan mudah.</p> 
    Sumatera Barat
    <div style="display: flex; gap: 12px; justify-content: center; margin: 16px 0;">
    <img src="/images/blog/barat.png" alt="Sumatera Barat" style="width: 50%; height: auto; border-radius: 8px;"/>
    </div>
    Riau
    <div style="display: flex; gap: 12px; justify-content: center; margin: 16px 0;">
    <img src="/images/blog/riau.png" alt="Riau" style="width: 50%; height: auto; border-radius: 8px;"/>
    </div>
    Sumatera Utara
    <div style="display: flex; gap: 12px; justify-content: center; margin: 16px 0;">
    <img src="/images/blog/utara.png" alt="Sumatera utara" style="width: 50%; height: auto; border-radius: 8px;"/>
    </div>
    <p></p>
    <h3>Proses Perhitungan</h3>
    <p>Setelah Anda mengetahui harga per wilayah kami, penting untuk memahami bagaimana total biaya pengiriman Anda dihitung. 
    Kami menerapkan formula yang transparan agar Anda bisa memperkirakan pengeluaran dengan jelas. </p>
    <p>Rumus perhitungannya adalah sebagai berikut:</p>
    <h3 class="text-center">Total = Berat × Harga Wilayah + Ongkos Jemput</h3>
    <p>Dengan rumus ini, Anda bisa dengan mudah menghitung estimasi biaya pengiriman Anda sebelum melakukan pemesanan.</p>
    

    `
  },
];


export default BlogData;
