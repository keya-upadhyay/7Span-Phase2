"use client";
import PaintingStoryCard from "@/app/components/PaintingStoryCard";
import {
  breakpointColumnsForMasonry,
  breakpointTwoColumnsForMasonry,
  pagePerLimitForPainting,
} from "@/utils/constant";
import React, { useEffect, useState } from "react";
import { TablePagination } from "./Pagination";
import Masonry from "react-masonry-css";
import MdiMagnify from "@/assets/icons/MdiMagnify";
import InputText from "./form/InputText";
import MdiWindowClose from "@/assets/icons/MdiWindowClose";
import useDebounce from "@/utils/useDebounce";

const PaintingByStoryIndex = ({ list }) => {
  const { debounce } = useDebounce();
  const [isLoading, setIsLoadint] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(pagePerLimitForPainting);
  const [totalPage, setTotalPage] = useState();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setData(list?.data);
    setTotalPage(list?.total);
  }, []);

  const fetchData = (searchKey = "") => {
    setIsLoadint(true);
    fetch(
      `${process.env.NEXT_PUBLIC_DIRECTUS_URL}paintings/by-story?page=${page}&perPage=${perPage}&filters[search]=${searchKey}`
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
      <div className="mb-10 flex items-start space-x-4 ">
        <div className="relative w-full max-w-4xl mx-auto">
          <MdiMagnify className="h-4 w-4 md:h-6 md:w-6 absolute inset-y-0 left-3 md:left-5 my-auto text-primary-700" />
          <InputText
            magnify={true}
            value={search}
            iconBefore
            iconAfter
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
              className="h-3 w-3 md:h-4 md:w-4 absolute cursor-pointer inset-y-0 right-5 my-auto text-primary-700"
              onClick={() => {
                setSearch("");
                debouncedFetchData("");
              }}
            />
          )}
        </div>
      </div>
      <Masonry
        breakpointCols={
          data.lenght > 2
            ? breakpointColumnsForMasonry
            : breakpointTwoColumnsForMasonry
        }
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((item, index) => (
          <PaintingStoryCard
            key={item.image_link + index}
            item={item}
            image={item.image_link}
            title={item?.pemm_short_title}
            content={`${
              item?.manuscript_date_range_start &&
              item?.manuscript_date_range_end
                ? item.manuscript_date_range_start ===
                  item.manuscript_date_range_end
                  ? item.manuscript_date_range_start + "s"
                  : item.manuscript_date_range_start +
                    "-" +
                    item.manuscript_date_range_end
                : "-"
            }${item?.manuscript ? ", " + item.manuscript : ""}${
              item?.painting_folio ? ", f. " + item.painting_folio : ""
            }${item?.painting_scan ? ", s. " + item.painting_scan : ""}`}
            btnText={`View 
            ${
              item.painting_count > 1
                ? `all ${item.painting_count} images for`
                : "the one painting for"
            }
            this story`}
            btnLink={` ${
              item.painting_count > 1
                ? "/paintings/by-story/" + item.canonical_story_id
                : `/paintings/${item.web_page_address}_${item.painting_unique_id}`
            }`}
          />
        ))}
      </Masonry>
      {Boolean(!data?.length) && (
        <div className="flex items-center py-36 justify-center  w-full text-2xl text-primary-500 font-bold">
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

export default PaintingByStoryIndex;
