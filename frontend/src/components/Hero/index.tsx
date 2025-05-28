"use client";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 mt-20">
      <div className="container mx-auto flex flex-col-reverse items-center justify-between px-4 md:flex-row md:px-8">
        {/* Left: Text */}
        <div className="w-full md:w-1/2 text-center md:text-left relative  z-10">
          <h1 className="text-4xl font-extrabold text-black leading-tight mb-4 ml-12">
            CV Gemilang Cargo Express
          </h1>
          <p className="text-gray-700 text-base  ml-12">
          Perusahaan ini merupakan penyedia layanan pengiriman barang cargo yang melayani rute dari Jakarta ke berbagai daerah di Pulau Sumatera dengan cepat, aman, dan terpercaya 
          </p>
        </div>

        {/* Right: Image & Background Circle */}
        <div className="relative w-full md:w-1/2 h-80 flex items-center justify-center ">
          {/* Blue circle background */}
          <div className="pointer-events-none absolute -right-95 -top-100 w-[800px] h-[800px] bg-blue-600 rounded-full z-0"></div>


          {/* Truck image */}
          <Image
            src="/images/delivery_car.png" 
            alt="Truck"
            width={400}
            height={400}
            className="relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
