import React from "react";
import PaintingDetail from "@assets/images/painting-detail.jpg";
import Link from "next/link";
import { defaultImageforPainting } from "@/utils/constant";

const PaintingStoryCard = ({
  image,
  title,
  content,
  desc,
  btnText,
  btnLink,
}) => {
  return (
    <div
      className={`rounded-lg text-offWhite-500 font-body mb-4 mx-auto  inline-block relative overflow-hidden w-full sm:mx-4 sm:w-[96%] `}
    >
      <div className=" bg-offWhite-500">
        <img
          src={Boolean(image) ? image : defaultImageforPainting}
          alt="PEMM"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-black p-5">
        <h2 className="lg:text-2xl font-bold mt-3">
          {title ? title : "PEMM title not found"}
        </h2>
        <p className="text-xs break-words">{content}</p>
        {desc && <p className="text-xs break-words">{desc}</p>}

        {btnText && btnLink && (
          <Link
            href={btnLink}
            className="border border-offWhite-500 my-4 inline-block py-2 px-3 text-xs md:text-sm hover:transition-all rounded-md hover:border-black 
        transition-all hover hover:bg-secondary-500 hover:text-offBlack-500"
          >
            {btnText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PaintingStoryCard;
