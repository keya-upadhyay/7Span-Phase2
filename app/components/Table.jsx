import { MANUSCRIPT_DETAIL } from "@/utils/constant";
import Link from "next/link";
import React from "react";

const Table = ({ isPageName, tableHeader, tableData, toggleBtn }) => {
  return (
    <div className="relative overflow-auto">
      <table className="table  w-full shadow divide-y divide-gray-100 font-menu rounded-t-sm">
        <thead className="font-medium bg-primary-500 text-white rounded-t-sm">
          <tr>
            {tableHeader?.map((item, index) => (
              <th
                className="min-w-[160px] px-6 py-3 text-left text-sm font-medium capitalize tracking-wider"
                key={index}
              >
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="min-h-[300px] divide-y divide-gray-100 bg-background-500 text-sm font-light text-primary-500">
          {tableData?.length
            ? tableData?.map((event, index) => (
                <React.Fragment key={index}>
                  {(event?.canonical_story_title ||
                    event?.manuscript_full_name ||
                    event?.manuscript_full_name) && (
                    <tr>
                      <td
                        className="w-full px-6 py-4 font-bold underline"
                        colSpan="6"
                      >
                        <Link href="#">
                          {isPageName === STORIES &&
                            event.canonical_story_title}
                          {isPageName === MANUSCRIPTS &&
                            event.manuscript_full_name}
                          {isPageName === MANUSCRIPT_DETAIL &&
                            event.manuscript_detail_full_name}
                        </Link>
                      </td>
                    </tr>
                  )}

                  {!toggleBtn && (
                    <tr key={index} className="text-offBlack font-medium">
                      <td className="max-w-xs whitespace-normal break-words px-6 py-4">
                        {event.canonical_story_id}
                      </td>
                      <td className="max-w-xs whitespace-normal break-words px-6 py-4">
                        {event.earliest_attestation}
                      </td>
                      <td className="max-w-xs whitespace-normal break-words px-6 py-4">
                        {event.total_records}
                      </td>
                      <td className="max-w-xs whitespace-normal break-words px-6 py-4">
                        {event.total_story_id_paintings}
                      </td>
                      <td className="max-w-xs whitespace-normal break-words px-6 py-4">
                        {event.type_of_story}
                      </td>
                      <td className="max-w-xs whitespace-normal break-words px-6 py-4">
                        {event.canonical_story_subject}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
