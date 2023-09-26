"use client";
import React, { useEffect, useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import MdiOpenInNew from "@/assets/icons/MdiOpenInNew";
import ImageGallery from "react-image-gallery";
import Link from "next/link";
import { defaultImageforPainting } from "@/utils/constant";
import BackBtn from "./BackBtn";

const PaintingDetail = ({ data }) => {
  const [image, setImage] = useState([]);

  useEffect(() => {
    setImage([
      {
        original: data?.image_link ? data.image_link : defaultImageforPainting,
        thumbnail: data?.image_link ? data.image_link : defaultImageforPainting,
      },
    ]);
  }, [data]);

  const generateParagraph = () => {
    const arr = [];
    if (
      data.manuscript_date_range_start ||
      data.manuscript_date_range_end ||
      data.manuscript_name
    ) {
      let text;
      if (data.manuscript_date_range_start && data.manuscript_date_range_end) {
        text = `This painting (also called an illumination) appears in a manuscript dated to ${
          data.manuscript_date_range_start === data.manuscript_date_range_end
            ? manuscript_date_range_end
            : data.manuscript_date_range_start +
              "-" +
              data.manuscript_date_range_end
        }. `;
      }
      if (data.manuscript_name) {
        text += `You can view this painting in the manuscript (<a class="text-primary-500 font-bold" href="${
          data.manuscript_link
        }" >${data.manuscript_name}</a>${
          data.painting_folio ? ", f. " + data.painting_folio : ""
        }) or learn more about this manuscript at <a class="text-primary-500 font-bold" href="/manuscripts/${
          data.web_page_address
        }" >link</a>. You can also read the related <a class="text-primary-500 font-bold" href="/stories/${
          data.canonical_story_id
        }">story<a>.`;
      }
      arr.push({ text });
    }
    if (data.canonical_story_id && data?.number_of_episodes) {
      if (data.number_of_episodes >= 2)
        arr.push({
          text: `Many Geʿez manuscript paintings are in "Synoptic Narrative Art” style; that is, a single painting depicts multiple moments in the story, providing a series of vignettes representing different plot points. PEMM calls these episodes. This painting of PEMM Story ID ${data.canonical_story_id} has ${data?.number_of_episodes} episodes. The description of the episodes in this painting, their locations, and their keywords is`,
        });
      if (data.number_of_episodes === 1) {
        arr.push({
          text: `This painting of PEMM Story ID ${data.canonical_story_id} depicts ${data.number_of_episodes} moment (or episode) in the story. The description of the episode in this painting and its keyword(s) is`,
        });
      }
    }
    if (data.episode_descriptions.length) {
      for (let text of data.episode_descriptions) {
        arr.push({ text });
      }
    }
    if (data?.episode_caption) {
      arr.push({
        text: `This painting has a caption in Geʿez, which Jeremy Brown has translated as ${data.episode_caption}.`,
      });
    }
    if (
      data?.total_manuscripts_with_this_story_id_illustrated ||
      data.total_story_id_paintings
    ) {
      let text;
      if (data?.total_manuscripts_with_this_story_id_illustrated) {
        text = `The number of PEMM manuscripts that have paintings of this story is ${data?.total_manuscripts_with_this_story_id_illustrated}.`;
      }
      if (data.total_story_id_paintings)
        text += ` The total number of paintings of this story in PEMM manuscripts is ${data.total_story_id_paintings}.`;
      arr.push({
        text,
      });
    }
    if (data.painting_unique_id) {
      arr.push({
        text: ` PEMM's ID number for this painting is ${data.painting_unique_id}.`,
      });
    }
    return arr;
  };

  console.log(generateParagraph(), "generateParagraph");
  console.log(data, "painting-index");

  return (
    <div className="container-fluid py-4 lg:py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-7 md:gap-7 lg:gap-10 xl:gap-20 2">
        <div className="space-y-5">
          <BackBtn />

          <ImageGallery
            items={image}
            infinite={false}
            autoPlay={false}
            showThumbnails={false}
            showPlayButton={false}
          />
        </div>

        <div className=" col-span-2 text-offBlack-400 ">
          {/* <h3 className="text-primary-500 font-menu text-2xl lg:text-4xl font-medium">
            {data.pemm_short_title
              ? data.pemm_short_title
              : "PEMM title not found"}
          </h3>
          <div className="space-y-1 font-body text-base lg:text-xl mt-3">
            <p>
              11<strong> Painting's Number of Episodes: </strong>&nbsp;
              {data?.number_of_episodes ? data?.number_of_episodes : "none"}
            </p>
            <p>
              12<strong> PEMM Painting Episode Captions: </strong>&nbsp;
              {!data.episode_descriptions.length && (
                <span className="font-normal">none</span>
              )}
              {data.episode_descriptions.length && (
                <ul className="list-inside text-offBlack-500">
                  {data.episode_descriptions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </p>
            <p>
              13<strong> Painting's Gəˁəz Caption in Translation: </strong>
              &nbsp;
              {data?.episode_caption ? data?.episode_caption : "none"}
            </p>
            <p>
              14<strong>Objects in Painting:</strong>&nbsp;
              {data.episode_keywords_objects
                ? data.episode_keywords_objects
                : "none"}
            </p>
            <p>
              15<strong>Agents in Painting:</strong>&nbsp;
              {data.episode_keywords_agents
                ? data.episode_keywords_agents
                : "none"}
            </p>
            <p>
              16<strong>Manuscript: </strong>&nbsp;
              <Link
                href={data.manuscript_link}
                className="text-primary-600 hover:underline"
              >
                {data.manuscript_name && data.manuscript_name}
              </Link>
              {data.painting_folio ? ", f. " + data.painting_folio : ""}&nbsp;
              <strong>Date</strong>:&nbsp;
              {data.manuscript_date_range_start &&
              data.manuscript_date_range_end
                ? data.manuscript_date_range_start ===
                  data.manuscript_date_range_end
                  ? manuscript_date_range_end
                  : data.manuscript_date_range_start +
                    "-" +
                    data.manuscript_date_range_end
                : "-"}
            </p>
            <p>
              17<strong> PEMM Painting ID:</strong>&nbsp;
              {data.painting_unique_id ? data.painting_unique_id : "none"}
            </p>
            <p>
              18<strong> PEMM Story ID:</strong>&nbsp;
              <Link
                href={"/stories/" + data.canonical_story_id}
                className="text-primary-600 hover:underline"
              >
                {data.canonical_story_id ? data.canonical_story_id : "none"}
              </Link>
            </p>
            <p>
              19
              <strong>
                PEMM Manuscripts with paintings of this story:&nbsp;
              </strong>
              {data.total_manuscripts_with_this_story_id_illustrated
                ? data.total_manuscripts_with_this_story_id_illustrated
                : "none"}
            </p>
            <p>
              20<strong>Total paintings of this story:&nbsp;</strong>
              {data.total_story_id_paintings
                ? data.total_story_id_paintings
                : "none"}
            </p>
          </div> */}
          <div className="space-y-1 font-body text-base lg:text-xl mt-3">
            <ul className="list-inside text-offBlack-500 leading-loose">
              {generateParagraph().map((item, index) => (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                ></li>
              ))}
            </ul>
          </div>
          <div className="lg:space-x-5 space-y-5 lg:space-y-0 pt-3 md:pt-10 text-offWhite-500 font-semibold font-body flex items-start text-sm md:text-base flex-col lg:flex-row ">
            <Link
              className="bg-secondary-500 rounded-md space-x-2 inline-flex items-center px-2 sm:px-3 py-1"
              href={`/paintings/by-manuscript/${data.web_page_address}`}
            >
              <MdiOpenInNew className="sm:h-6 sm:w-6" />
              <span>View Paintings by Manuscript</span>
            </Link>
            <Link
              className="bg-secondary-500 rounded-md space-x-2 inline-flex items-center px-2 sm:px-3 py-1"
              href={`/paintings/by-story/${data.canonical_story_id}`}
            >
              <MdiOpenInNew className="sm:h-6 sm:w-6" />
              <span>View Paintings by Story</span>
            </Link>

            {/* Next and previous buttons  */}
            {/* <button
              className="bg-secondary-500 rounded-md px-3 py-1"
              href="/manuscripts"
            >
              Previous Painting
            </button>
            <button
              className="bg-secondary-500 rounded-md px-3 py-1"
              href="/manuscripts"
            >
              Next Painting
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingDetail;
