import MdiArrowUp from "@/assets/icons/MdiArrowUp";
// import ReactPaginate from "react-paginate";
import Pagination from "react-js-pagination";

export const TablePagination = ({ meta, isOpen, onPageChange, ...rest }) => {
  let pageCount = Math.ceil(meta.total / meta.per_page);
  return (
    <>
      {pageCount > 1 ? (
        // <ReactPaginate
        //   className="static flex divide-x-2 divide-primary-500 max-w-full justify-center bg-offWhite-500 py-2 lg:ml-auto"
        //   breakLabel="..."
        //   pageClassName="pagination-button flex h-10 min-w-[40px] items-center justify-center border-y-2 border-y-primary-500 text-base text-primary-500"
        //   nextLabel={<NextPage meta={meta} />}
        //   pageCount={Math.ceil(meta.total / meta.per_page)}
        //   previousLabel={<PrevPage meta={meta} />}
        //   renderOnZeroPageCount={null}
        //   onPageChange={(e) => onPageChange(e.selected + 1)}
        //   activeClassName="!bg-primary-500 !text-white"
        //   {...rest}
        // />
        <Pagination
          activePage={meta.page}
          itemsCountPerPage={meta.per_page}
          totalItemsCount={meta.total}
          pageRangeDisplayed={3}
          onChange={(e) => {
            onPageChange(e);
          }}
        />
      ) : null}
    </>
  );
};

export const PaginationLoader = () => {
  return (
    <>
      <div className="relative h-10">
        <div className="mb-4 flex h-1.5 overflow-hidden text-xs">
          <div
            style={{ width: "100%" }}
            className="h-full w-0 animate-ping bg-blue-500"
          ></div>
        </div>
      </div>
    </>
  );
};

const NextPage = ({ meta }) => {
  return (
    <>
      <span
        className={`flex h-10 min-w-[50px] items-center justify-center p-2 text-base ${
          meta.current_page === meta.last_page
            ? " text-slate-300"
            : "text-primary-400"
        }`}
      >
        <MdiArrowUp className="h-6 w-6 rotate-90" />
      </span>
    </>
  );
};

const PrevPage = ({ meta }) => {
  return (
    <>
      <span
        className={`flex h-10 min-w-[50px] items-center justify-center p-2 text-base ${
          meta.current_page === 1 ? " text-slate-300" : "text-primary-400"
        }`}
      >
        <MdiArrowUp className="h-6 w-6 -rotate-90" />
      </span>
    </>
  );
};
