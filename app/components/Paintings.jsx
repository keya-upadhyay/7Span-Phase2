"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import InputText from "./form/InputText";
import PaintingCard from "./PaintingCard";
import Dropdown from "./Dropdown";
import {
  breakpointColumnsForMasonry,
  pagePerLimitForPainting,
} from "@/utils/constant";
import CustomPagination, { TablePagination } from "./Pagination";
import useDebounce from "@/utils/useDebounce";
import MdiWindowClose from "@/assets/icons/MdiWindowClose";
import Masonry from "react-masonry-css";
import OutsideClickHandler from "react-outside-click-handler";
import MdiClose from "@/assets/icons/MdiClose";
import MdiMenuOpen from "@/assets/icons/MdiMenuOpen";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Paintings = ({
  dateOfPainting,
  paintingInColor,
  typeOfStory,
  institution,
}) => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const newParams = new URLSearchParams();
  const pageP = params.get("page");
  const pageParams = pageP > 1 ? pageP : 1;
  const searchP = params.get("search");
  const searchParams = searchP ? searchP : "";
  const [page, setPage] = useState(pageParams);
  const { debounce } = useDebounce();
  const [perPage, setPerPage] = useState(pagePerLimitForPainting);
  const [search, setSearch] = useState(searchParams);
  const [totalPage, setTotalPage] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateOfPaintins, setDateOfPaintins] = useState([]);
  const [paintingsInColorOnly, setPaintingsInColorOnly] = useState([]);
  const [storyType, setStoryType] = useState();
  const [archiveOfPainting, setArchiveOfPainting] = useState();
  const [isMount1, setIsMount1] = useState(false);

  const makeParamsArray = (key, arr) => {
    if (arr.length)
      if (key === "dateOfPainting")
        return arr
          .map((itm) => {
            setFilterInParams(key, itm.value, false);
            return `filters[${key}][]=${itm.key}&`;
          })
          .join("");
      else
        return arr
          .map((itm) => {
            setFilterInParams(key, itm.value, false);
            return `filters[${key}]=${itm.key}&`;
          })
          .join("");
    return "";
  };

  const fetchData = async (searchKey = "") => {
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

    setLoading(true);
    try {
      const params = `page=${page}&perPage=${perPage}&${makeParamsArray(
        "dateOfPainting",
        dateOfPaintins
      )}${makeParamsArray(
        "paintingInColor",
        paintingsInColorOnly
      )}${makeParamsArray(
        "typeOfStory",
        Boolean(storyType) ? [storyType] : []
      )}${makeParamsArray(
        "institution",
        Boolean(archiveOfPainting) ? [archiveOfPainting] : []
      )}filters[search]=${searchKey}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DIRECTUS_URL}paintings?${params}`
      );
      const resData = await response.json();
      setTotalPage(resData.total);
      setData(resData.data);
      setLoading(false);
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMount1) {
      setPage(1);
      fetchData(search);
    } else {
      setPage(pageParams);
      getFilterFromParams();
    }
  }, [dateOfPaintins, paintingsInColorOnly, storyType, archiveOfPainting]);

  useEffect(() => {
    if (isMount1) fetchData(search);
  }, [page]);

  const debouncedFetchData = debounce(fetchData, 300);
  const paintingBy = [
    {
      value: "Paintings by Story",
      key: "/paintings/by-story",
    },
    {
      value: "Paintings by Manuscript",
      key: "paintings/by-manuscript",
    },
  ];

  const [menuCollapse, setMenuCollapse] = useState(false);

  useEffect(() => {
    if (menuCollapse) {
      document.body.classList.add("sidebar_open");
      document.body.classList.remove("sidebar_close");
      document.body.classList.remove("filter_open");
      document.body.classList.remove("filter_close");
    } else {
      document.body.classList.add("sidebar_close");
      document.body.classList.remove("sidebar_open");
      document.body.classList.remove("filter_open");
      document.body.classList.remove("filter_close");
    }
  }, [menuCollapse]);

  const menuIconClick = () => {
    setMenuCollapse(!menuCollapse);
  };

  const setFilterInParams = (key, value, isRemove = false) => {
    if (isRemove) return;
    if (["dateOfPainting", "paintingInColor"].includes(key)) {
      newParams.append(key, value);
    } else newParams.set(key, value);

    router.push(`${pathname}?${newParams.toString()}`);
  };

  const getFilterFromParams = () => {
    setIsMount1(true);
    const search = params.get("search");
    setSearch(search ? search : "");
    const pageP = params.get("page");
    setPage(pageP > 1 ? pageP : 1);

    const datePainting = params.getAll("dateOfPainting");
    console.log(dateOfPainting, "dateOfPainting");

    const newDatePainting = dateOfPainting.filter((dop) =>
      datePainting.includes(dop.value)
    );
    setDateOfPaintins(newDatePainting);
  };

  return (
    <div className="container-fluid">
      <button
        onClick={menuIconClick}
        className="block h-7 w-7 flex-none p-1 z-40  lg:hidden"
      >
        <MdiMenuOpen className="text-primary-500" />
      </button>
      <div className="mx-auto sm:grid pt-4 sm:grid-cols-4 lg:grid-cols-6 gap-2 items-center justify-start mb-3">
        <div className="relative w-full sm:col-span-4 md:max-w-4xl lg:col-span-2">
          <span className="bg-offWhite-500 px-1 absolute -top-2 left-4 text-sm text-primary-500">
            Search titles and painting descriptions
          </span>
          <InputText
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
              className="h-3 w-3 md:h-4 md:w-4 absolute cursor-pointer inset-y-0 right-5 my-auto text-primary-700"
              onClick={() => {
                setSearch("");
                debouncedFetchData("");
              }}
            />
          )}
        </div>
        <div className="col-span-2 lg:col-span-2 grid justify-items-center items-center sm:justify-items-start lg:justify-items-center pt-3 md:pt-0">
          <CustomPagination
            className="pagination-tablet"
            currentPage={page}
            totalPages={Math.ceil(totalPage / perPage)}
            onPageChange={(num) => {
              setPage(num);
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="text-center block h-auto py-3  font-medium xl:text-sm text-xs md:w-full">
            Results: ({totalPage ? totalPage : 0} records)
          </div>
        </div>
        <div className="lg:col-span-1">
          <Dropdown
            title="All Paintings"
            options={paintingBy}
            isMultiple={false}
          />
        </div>
      </div>

      {/* sidebar filter start  */}

      <OutsideClickHandler
        onOutsideClick={() => {
          setMenuCollapse(false);
        }}
      >
        <div
          className={`z-50 justify-between bg-offWhite-500 items-center p-6 inset-y-0 w-80 right-auto fixed transition-transform duration-700  ${
            menuCollapse
              ? "open -translate-x-5 sm:-translate-x-14 transform"
              : "-translate-x-96 close transform"
          } `}
        >
          <button
            className="text-right block "
            onClick={() => {
              setMenuCollapse(!menuCollapse);
            }}
          >
            <MdiClose />
          </button>
          <div className="text-lg p-1 font-semibold space-y-4 mt-4">
            <div>
              <Dropdown
                title="Date of Paintings"
                selected={dateOfPaintins}
                setSelected={(e) => {
                  setDateOfPaintins(e);
                  setTimeout(() => {
                    setMenuCollapse(false);
                  }, 5000);
                }}
                options={dateOfPainting}
                isMultiple={true}
              />
            </div>
            <div>
              <Dropdown
                title="Digital Quality"
                selected={paintingsInColorOnly}
                setSelected={(e) => {
                  if (e.length > 2) {
                    setPaintingsInColorOnly([e[e.length - 2], e[e.length - 1]]);
                  } else {
                    setPaintingsInColorOnly(e);
                  }
                  setTimeout(() => {
                    setMenuCollapse(false);
                  }, 5000);
                }}
                options={paintingInColor}
                isMultiple={true}
              />
            </div>
            <div>
              <Dropdown
                title="Story Type"
                selected={storyType}
                setSelected={(e) => {
                  setStoryType(e);
                  setTimeout(() => {
                    setMenuCollapse(false);
                  }, 5000);
                }}
                options={typeOfStory}
                isMultiple={false}
              />
            </div>
            <div>
              <Dropdown
                title="Repository of Painting"
                selected={archiveOfPainting}
                setSelected={(e) => {
                  setArchiveOfPainting(e);
                  setTimeout(() => {
                    setMenuCollapse(false);
                  }, 5000);
                }}
                options={institution}
                isMultiple={false}
              />
            </div>
            <div className="text-center w-full md:text-left">
              <button
                className="bg-primary-500 w-full text-white p-2 text-center rounded-lg text-xs md:text-sm"
                onClick={() => {
                  setDateOfPaintins([]);
                  setPaintingsInColorOnly([]);
                  setStoryType(null);
                  setArchiveOfPainting(null);
                  setPage(1);
                  setSearch("");
                  setTimeout(() => {
                    setMenuCollapse(false);
                  }, 5000);
                  router.push(`${pathname}`);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </OutsideClickHandler>

      {/* sidebar filter ENd  */}

      <div className="mb-1 font-body lg:mx-auto lg:justify-normal">
        <div className="grid gap-2 grid-cols-1 justify-between mb-1 font-body lg:justify-between sm:grid-cols-4 lg:grid-cols-9">
          <div className="lg:col-span-2 hidden lg:block">
            <Dropdown
              title="Date of Paintings"
              selected={dateOfPaintins}
              setSelected={setDateOfPaintins}
              options={dateOfPainting}
              isMultiple={true}
            />
          </div>
          <div className="sm:col-span-2  hidden lg:block">
            <Dropdown
              title="Digital Quality"
              selected={paintingsInColorOnly}
              setSelected={(e) => {
                if (e.length > 2) {
                  setPaintingsInColorOnly([e[e.length - 2], e[e.length - 1]]);
                } else {
                  setPaintingsInColorOnly(e);
                }
              }}
              options={paintingInColor}
              isMultiple={true}
            />
          </div>
          <div className="sm:col-span-2  hidden lg:block">
            <Dropdown
              title="Story Type"
              selected={storyType}
              setSelected={setStoryType}
              options={typeOfStory}
              isMultiple={false}
            />
          </div>
          <div className="sm:col-span-2 hidden lg:block ">
            <Dropdown
              title="Repository of Painting"
              selected={archiveOfPainting}
              setSelected={setArchiveOfPainting}
              options={institution}
              isMultiple={false}
            />
          </div>
          <div className="text-center w-full md:text-left  hidden lg:block">
            <button
              className="bg-primary-500 w-full text-white p-2 text-center rounded-lg text-xs md:text-sm"
              onClick={() => {
                setDateOfPaintins([]);
                setPaintingsInColorOnly([]);
                setStoryType(null);
                setArchiveOfPainting(null);
                setPage(1);
                setSearch("");
                router.push(`${pathname}`);
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="pb-10 mt-10">
        {data?.length ? (
          <Masonry
            breakpointCols={breakpointColumnsForMasonry}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {data.map((card, index) => (
              <PaintingCard key={card.image_link + index} card={card} />
            ))}
          </Masonry>
        ) : (
          Boolean(!data?.length) && (
            <div className="flex items-center py-36 justify-center  w-full text-2xl text-primary-500 font-bold">
              {loading ? <h1>Loading...</h1> : <h1>Records Not Found</h1>}
            </div>
          )
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
    </div>
  );
};

export default Paintings;
