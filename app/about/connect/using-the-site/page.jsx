import { client } from "@/utils/directUs";
import { readItems } from "@directus/sdk";
export const dynamic = "force-dynamic";

export default async function page() {
  let about_using_this_site = null;

  try {
    about_using_this_site = await client.request(
      readItems("about_using_this_site", {
        fields: ["*.*.*"],
      })
    );
  } catch (e) {
    console.log(e);
  }

  return (
    <div className="container">
      <div className="space-y-4 py-12">
        <div className="people flex justify-center flex-col items-center">
          <h2 className="text-3xl font-header text-center lg:text-5xl">
            {about_using_this_site.using_the_site_title}
          </h2>
          <p className="text-center font-menu py-5 lg:w-2/3">
            {about_using_this_site.using_the_site_intro}
          </p>
          <div
            className="space-y-p text-center font-menu lg:w-2/3"
            dangerouslySetInnerHTML={{
              __html: about_using_this_site.using_the_site_description,
            }}
          />
        </div>
      </div>
    </div>
  );
}