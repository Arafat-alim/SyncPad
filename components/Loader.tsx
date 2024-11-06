"use client";

import Image from "next/image";

const Loader = () => {
  return (
    <div className="loader">
      <Image
        src="/public/assets/icons/loader.svg"
        alt="loader-image"
        width={32}
        height={32}
        className="animate-spin"
      />
    </div>
  );
};

export default Loader;
