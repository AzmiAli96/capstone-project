"use client";
import React from "react";
import Image from "next/image";
import featuresData from "./featuresData";

// Definisikan tipe data untuk feature
interface FeatureItem {
  id?: number;
  icon: React.ReactNode | string;
  title: string;
  description: string;
}

// Komponen untuk item feature individual
const FeatureCard = ({ feature }: { feature: FeatureItem }) => {
  return (
    <div className="group relative rounded-lg bg-white p-7.5 shadow-solid-3 transition-all hover:shadow-solid-4 dark:bg-blacksection dark:hover:bg-hoverdark xl:p-12.5">
      <div className="mb-7.5 flex h-16 w-16 items-center justify-center rounded-[4px] bg-primary text-white">
        {typeof feature.icon === 'string' ? (
          feature.icon.startsWith('/') ? (
            <Image 
              src={feature.icon} 
              alt={feature.title} 
              width={40}
              height={40}
              className="object-contain" 
            />
          ) : (
            feature.icon
          )
        ) : (
          feature.icon
        )}
      </div>
      <h3 className="mb-5 text-xl font-semibold text-black dark:text-white xl:text-itemtitle">
        {feature.title}
      </h3>
      <p className="mb-10 text-base leading-relaxed text-body-color dark:text-body-color-dark">
        {feature.description}
      </p>
    </div>
  );
};

// Komponen untuk judul section
const SectionHeader = ({ 
  headerInfo 
}: { 
  headerInfo: { 
    title: string; 
    subtitle: string; 
    description: string; 
  } 
}) => {
  return (
    <div className="text-center">
      <h4 className="mb-4 text-sm font-bold text-primary md:text-base lg:text-lg">
        {headerInfo.title}
      </h4>
      <h2 className="mb-4.5 text-3xl font-bold text-black dark:text-white md:text-4xl xl:text-sectiontitle2">
        {headerInfo.subtitle}
      </h2>
      <p className="mx-auto max-w-3xl text-base text-body-color dark:text-body-color-dark">
        {headerInfo.description}
      </p>
    </div>
  );
};

const Feature = () => {
  const headerInfo = {
    title: "Layanan Pengiriman Cargo Terpercaya",
    subtitle: "Cepat, Aman, dan Handal",
    description: `Perusahaan ini merupakan penyedia layanan pengiriman barang cargo yang berfokus pada rute pengiriman 
    dari Jakarta ke berbagai daerah di Pulau Sumatera. Dengan komitmen terhadap kecepatan, keamanan, dan keandalan layanan, 
    kami memastikan setiap pengiriman tiba tepat waktu dan dalam kondisi terbaik.`,
  };

  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section id="features" className="py-20 lg:py-25 xl:py-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader headerInfo={headerInfo} />
          {/* <!-- Section Title End --> */}

          <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
            {/* <!-- Features item Start --> */}
            {featuresData.map((feature, key) => (
              <FeatureCard feature={feature} key={key} />
            ))}
            {/* <!-- Features item End --> */}
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default Feature;