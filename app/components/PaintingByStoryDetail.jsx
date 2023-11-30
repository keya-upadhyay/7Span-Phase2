"use client";
import React, { useEffect, useState } from "react";
import PaintingStoryCard from "./PaintingStoryCard";
import {
  breakpointColumnsForMasonry,
  pagePerLimitForPainting,
} from "@/utils/constant";
import Masonry from "react-masonry-css";
import CustomPagination, { TablePagination } from "./Pagination";
import BackBtn from "./BackBtn";
import Link from "next/link";
import InputText from "./form/InputText";
import MdiWindowClose from "@/assets/icons/MdiWindowClose";
import useDebounce from "@/utils/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PaintingByStoryDetail = ({ list, Id }) => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const newParams = new URLSearchParams();
  const pageP = params.get("page");
  const pageParams = pageP > 1 ? pageP : 1;
  const searchP = params.get("search");
  const searchParams = searchP ? searchP : "";
  const { debounce } = useDebounce();
  const [search, setSearch] = useState(searchParams);
  const [isLoading, setIsLoadint] = useState(true);
  const [page, setPage] = useState(pageParams);
  const [perPage, setPerPage] = useState(pagePerLimitForPainting);
  const [totalPage, setTotalPage] = useState();
  const [data, setData] = useState([]);
  const [header, setHeader] = useState();

  useEffect(() => {
    setData(list?.data);
    setHeader(list?.canonicalStoryData);
    setTotalPage(list?.total);
  }, []);

  const fetchData = (searchKey = search) => {
    setIsLoadint(true);
    if (searchKey.length > 3) {
      setFilterInParams("search", searchKey, false);
    }
    if (searchKey.length === 0) {
      setFilterInParams("search", searchKey, true);
    }

    if (page !== 1) {
      setFilterInParams("page", page, false);
    } else {
      setFilterInParams("page", page, true);
    }
    fetch(
      `${
        process.env.NEXT_PUBLIC_DIRECTUS_URL
      }paintings/by-story/${Id}?page=${page}&perPage=${perPage}&filters[search]=${
        searchKey.length > 3 ? searchKey : ""
      }`
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

  const setFilterInParams = (key, value, isRemove = false) => {
    if (isRemove || !value) {
      newParams.delete(key);
      router.push(`${pathname}?${newParams.toString()}`);
      return;
    }
    newParams.set(key, value);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="container-fluid py-4 lg:py-10">
      <BackBtn />
      <h2 className="text-2xl lg:text-3xl xl:text-4xl text-primary-500 font-bold font-body">
        {header?.canonical_story_title}
      </h2>
      <div className="sm:grid lg:grid-cols-5 sm:grid-cols-2 w-full mt-2 items-center font-body">
        <div className="relative w-full col-span-2  max-w-4xl mx-auto mb-3 lg:mb-0">
          <label
            for="Search painting by story detail"
            className="bg-offWhite-500 px-1 absolute -top-2 left-4 text-sm text-primary-500"
          >
            Search painting descriptions
          </label>
          <InputText
            id="Search painting by story detail"
            value={search}
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
        <div className=" lg:text-center lg:col-span-2 my-3 grid justify-items-center sm:justify-items-start lg:justify-items-center">
          <CustomPagination
            className="pagination-tablet"
            currentPage={page}
            totalPages={Math.ceil(totalPage / perPage)}
            onPageChange={(num) => {
              setPage(num);
            }}
          />
        </div>
        <p className=" text-offBlack-400 order-3 text-center xl:text-sm sm:text-right sm:-order-none lg:ml-0 ml-auto mr-0 sm:mt-0 mt-4 font-medium text-xs lg:col-span-1">
          Results: ({totalPage ? totalPage : 0} records)
        </p>
      </div>
      <div className="pt-5 lg:pt-10">
        <Masonry
          breakpointCols={breakpointColumnsForMasonry}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {data?.map((item, index) => (
            <Link
              href={`/paintings/${item.web_page_address}_${item.painting_unique_id}`}
              key={item.image_link + index}
              className={`rounded-lg text-offWhite-500 font-body mb-4 mx-auto  inline-block relative overflow-hidden w-full`}
            >
              <PaintingStoryCard
                key={item.image_link + index}
                image={item.image_link}
                isTitle={false}
                content={item.episodes}
                // desc={`Keywords: ${
                //   item.episode_keywords_objects
                //     ? item.episode_keywords_objects + "; "
                //     : ""
                // }${
                //   item.episode_keywords_agents ? item.episode_keywords_agents : ""
                // }`}
                desc={`${
                  item?.manuscript_date_range_start &&
                  item?.manuscript_date_range_end
                    ? item.manuscript_date_range_start ===
                      item.manuscript_date_range_end
                      ? item.manuscript_date_range_start
                      : item.manuscript_date_range_start +
                        "-" +
                        item.manuscript_date_range_end
                    : "-"
                }${item?.manuscript ? ", " + item.manuscript : ""}${
                  item.painting_folio ? ", f. " + item.painting_folio : ""
                }${item.painting_scan ? ", s. " + item.painting_scan : ""}`}
                className="mt-3"
              />
            </Link>
          ))}
        </Masonry>
      </div>
      {Boolean(!data?.length) && (
        <div className="flex items-center py-36 justify-center  w-full text-2xl text-primary-500 font-bold">
          {isLoading ? <h1>Loading...</h1> : <h1>Records Not Found</h1>}
        </div>
      )}
      {/* <TablePagination
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
      /> */}
    </div>
  );
};

export default PaintingByStoryDetail;
