import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { ZodType } from "zod";

import { BlogFrontmatterSchema, ProjectFrontmatterSchema } from "@/schemas";
import type {
  BlogFrontmatter,
  MdxContent,
  MdxFrontmatter,
  ProjectFrontmatter,
  Result,
} from "@/types";

import { serializeMdx } from "./mdx-serialize";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
const MDX_EXTENSION = ".mdx";

async function getMdxSlugs(contentType: string): Promise<Result<string[]>> {
  try {
    const contentDirectory = path.join(CONTENT_ROOT, contentType);
    const fileNames = await readdir(contentDirectory);
    const slugs = fileNames
      .filter((fileName) => fileName.endsWith(MDX_EXTENSION))
      .map((fileName) => fileName.replace(MDX_EXTENSION, ""));

    return {
      success: true,
      data: slugs,
    };
  } catch (error) {
    console.error("Failed to read MDX directory:", error);

    return {
      success: false,
      error: "Failed to load content list",
    };
  }
}

async function getMdxBySlug<TFrontmatter extends MdxFrontmatter>(
  contentType: string,
  slug: string,
  schema: ZodType<TFrontmatter>,
): Promise<Result<MdxContent<TFrontmatter>>> {
  try {
    if (slug.trim().length === 0) {
      return {
        success: false,
        error: "Content slug is required",
      };
    }

    const filePath = path.join(CONTENT_ROOT, contentType, `${slug}.mdx`);
    const source = await readFile(filePath, "utf-8");
    const serializedMdx = serializeMdx(source, schema);

    if (!serializedMdx.success) {
      return {
        success: false,
        error: serializedMdx.error,
      };
    }

    return {
      success: true,
      data: {
        slug,
        frontmatter: serializedMdx.data.frontmatter,
        content: serializedMdx.data.content,
      },
    };
  } catch (error) {
    console.error("Failed to load MDX content:", error);

    return {
      success: false,
      error: "Failed to load content",
    };
  }
}

async function getAllMdxContent<TFrontmatter extends MdxFrontmatter>(
  contentType: string,
  schema: ZodType<TFrontmatter>,
): Promise<Result<MdxContent<TFrontmatter>[]>> {
  const slugsResult = await getMdxSlugs(contentType);

  if (!slugsResult.success) {
    return {
      success: false,
      error: slugsResult.error,
    };
  }

  const contentResults = await Promise.all(
    slugsResult.data.map((slug) => getMdxBySlug(contentType, slug, schema)),
  );

  const failedContent = contentResults.find((result) => !result.success);

  if (failedContent && !failedContent.success) {
    return {
      success: false,
      error: failedContent.error,
    };
  }

  const content = contentResults
    .filter(
      (
        result,
      ): result is { success: true; data: MdxContent<TFrontmatter> } => {
        return result.success;
      },
    )
    .map((result) => result.data)
    .sort((firstItem, secondItem) => {
      return (
        new Date(secondItem.frontmatter.date).getTime() -
        new Date(firstItem.frontmatter.date).getTime()
      );
    });

  return {
    success: true,
    data: content,
  };
}

export async function getAllPosts(): Promise<
  Result<MdxContent<BlogFrontmatter>[]>
> {
  return getAllMdxContent("blog", BlogFrontmatterSchema);
}

export async function getPostBySlug(
  slug: string,
): Promise<Result<MdxContent<BlogFrontmatter>>> {
  return getMdxBySlug("blog", slug, BlogFrontmatterSchema);
}

export async function getAllProjects(): Promise<
  Result<MdxContent<ProjectFrontmatter>[]>
> {
  return getAllMdxContent("projects", ProjectFrontmatterSchema);
}
