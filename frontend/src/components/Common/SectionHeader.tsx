"use client";
import React from "react";

interface HeaderInfo {
  title: string;
  subtitle: string;
  description: string;
}

const SectionHeader = ({ headerInfo }: { headerInfo: HeaderInfo }) => {
  const { title, subtitle, description } = headerInfo;

  return (
    <>
      <div className="text-center">
        <h4 className="mb-4 text-sm font-bold text-primary md:text-base lg:text-lg">
          {title}
        </h4>
        <h2 className="mb-4.5 text-3xl font-bold text-black dark:text-white md:text-4xl xl:text-sectiontitle2">
          {subtitle}
        </h2>
        <p className="mx-auto max-w-3xl text-base text-body-color dark:text-body-color-dark">
          {description}
        </p>
      </div>
    </>
  );
};

export default SectionHeader;