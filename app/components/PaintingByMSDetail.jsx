"use client";
import React, { useEffect, useState } from "react";
import PaintingStoryCard from "./PaintingStoryCard";
import {
  breakpointColumnsForMasonry,
  pagePerLimitForPainting,
} from "@/utils/constant";
import Masonry from "react-masonry-css";
import useDebounce from "@/utils/useDebounce";
import MdiMagnify from "@/assets/icons/MdiMagnify";
import InputText from "./form/InputText";
import MdiWindowClose from "@/assets/icons/MdiWindowClose";
import { TablePagination } from "./Pagination";
import Link from "next/link";
import BackBtn from "./BackBtn";

const PaintingByMSDetail = ({ list, Id }) => {
  const { debounce } = useDebounce();
  const [isLoading, setIsLoadint] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(pagePerLimitForPainting);
  const [totalPage, setTotalPage] = useState();
  const [data, setData] = useState([]);
  const [header, setHeader] = useState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setData(list?.data);
    setHeader(list?.manuscriptData);
    setTotalPage(list?.total);
  }, []);

  const fetchData = (searchKey = "") => {
    setIsLoadint(true);
    fetch(
      `${process.env.NEXT_PUBLIC_DIRECTUS_URL}paintings/by-manuscript/${Id}?page=${page}&perPage=${perPage}&filters[search]=${searchKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setTotalPage(data.total);
        setIsLoadint(false);
      })
      .catch((error) => {
        console.error("Error", error);
        setIsLoadint(false);
      });
  };

  useEffect(() => {
    fetchData(search);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const debouncedFetchData = debounce((e) => {
    fetchData(e);
    setPage(1);
  }, 300);

  return (
    <div className="container-fluid py-4 lg:py-10">
      <BackBtn />
      {header && (
        <h2 className="font-menu text-2xl lg:text-3xl xl:text-5xl text-primary-500 font-medium">
          {header?.manuscript_full_name}&nbsp;(
          {`${
            header?.manuscript_date_range_start &&
            header?.manuscript_date_range_end
              ? header.manuscript_date_range_start ===
                header.manuscript_date_range_end
                ? header.manuscript_date_range_start + "s"
                : header.manuscript_date_range_start +
                  "-" +
                  header.manuscript_date_range_end
              : "-"
          }`}
          )
        </h2>
      )}
      <div className="mb-10 flex items-start space-x-4 ">
        <div className="relative w-full max-w-4xl mx-auto">
          <MdiMagnify className="h-4 w-4 absolute inset-y-0 left-3 my-auto text-primary-700 md:h-6 md:w-6 md:left-5" />
          <InputText
            magnify={true}
            value={search}
            iconBefore
            placeholderText="Search"
            onChange={(e) => {
              const query = e.target.value;
              setSearch(query);
              if (query.length > 3) {
                debouncedFetchData(query);
              }
              if (query.length === 0) {
                debouncedFetchData(query);
              }
            }}
          />

          {search && (
            <MdiWindowClose
              className="h-3 w-3 absolute cursor-pointer inset-y-0 right-5 my-auto text-primary-700 md:h-4 md:w-4"
              onClick={() => {
                setSearch("");
                debouncedFetchData("");
              }}
            />
          )}
        </div>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsForMasonry}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((item, index) => (
          <Link
            key={item.image_link + index}
            href={`/paintings/${Id}_${item.painting_unique_id}`}
            className={`rounded-lg text-offWhite-500 font-body mb-4 mx-auto  inline-block relative overflow-hidden w-full`}
          >
            <PaintingStoryCard
              key={item.image_link + index}
              image={item.image_link}
              title={item.pemm_short_title}
              content={item.episodes}
              desc={`Story ID ${item.canonical_story_id}${
                item.painting_folio ? ", f. " + item.painting_folio : ""
              }${item.painting_scan ? ", s. " + item.painting_scan : ""}`}
              className="mt-3"
            />
          </Link>
        ))}
      </Masonry>

      {Boolean(!data?.length) && (
        <div className="flex items-center py-36 justify-center w-full text-2xl text-primary-500 font-bold">
          {isLoading ? <h1>Loading...</h1> : <h1>Records Not Found</h1>}
        </div>
      )}
      <TablePagination
        meta={{
          total: totalPage,
          per_page: perPage,
          current_page: page,
          last_page: 50,
          page: page,
        }}
        isOpen={true}
        onPageChange={(num) => {
          setPage(num);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      />
    </div>
  );
};

export default PaintingByMSDetail;
