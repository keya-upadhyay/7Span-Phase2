import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import MdiChevronDown from "@assets/icons/MdiChevronDown";
import { useRouter } from "next/navigation";

const Dropdown = ({
  selected,
  setSelected,
  options,
  title,
  isMultiple = false,
}) => {
  const route = useRouter();
  const [flag, setFlag] = useState(true);

  return (
    <Listbox
      value={selected}
      onChange={(e) => {
        if (title === "All Paintings") {
          route.push(e?.key);
        } else {
          let ulist;
          if (["Date of Paintings", "Digital Quality"].includes(title)) {
            ulist = Object.values(
              e.reduce((acc, obj) => ({ ...acc, [obj.key]: obj }), {})
            );
          } else {
            ulist = e;
          }
          setFlag(!flag);
          setSelected(ulist);
        }
      }}
      multiple={isMultiple}
    >
      <div className="relative">
        <Listbox.Button className="option-box relative w-full font-body rounded-md cursor-default text-xs bg-primary-500 text-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-offWhite-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ">
          <span className="block truncate">
            {title === "Date of Paintings"
              ? title
              : selected?.value
              ? selected?.value
              : title}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <MdiChevronDown
              className="h-5 w-5 text-offWhite-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="option-box-option font-body  absolute mt-1 max-h-60 z-30 overflow-auto inset-x-0 rounded-md
           bg-primary-500 text-white py-1 text-xs  
          shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm xl:right-0 xl:left-auto xl:min-w-full"
          >
            {options.map((item, personIdx) => (
              <Listbox.Option
                key={item.key + personIdx}
                className={({ active }) =>
                  `relative cursor-default select-none transition-all py-2 pl-6 ${
                    title !== "All Paintings" && "lg:pl-8"
                  }  pr-2 lg:pr-4 ${
                    active ? "bg-offWhite-400 text-black" : "text-offwhite-500"
                  }`
                }
                value={item}
              >
                {(values) => {
                  let isSelected = false;
                  if (["Date of Paintings", "Digital Quality"].includes(title))
                    isSelected = Boolean(
                      selected?.find((itm) => itm.key === item?.key)
                    );
                  else isSelected = Boolean(selected?.key === item?.key);
                  return (
                    <>
                      <span
                        className={`block truncate ${
                          values.selected || isSelected
                            ? "font-medium"
                            : "font-normal"
                        }`}
                      >
                        {item.value}
                      </span>
                      {values.selected || isSelected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-secondary-500 lg:pl-3">
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  );
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default React.memo(Dropdown);
