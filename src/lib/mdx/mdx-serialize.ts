import matter from "gray-matter";
import type { ZodType } from "zod";

import type { Result } from "@/types";

interface SerializedMdx<TFrontmatter> {
  frontmatter: TFrontmatter;
  content: string;
}

export function serializeMdx<TFrontmatter>(
  source: string,
  schema: ZodType<TFrontmatter>,
): Result<SerializedMdx<TFrontmatter>> {
  try {
    const parsedSource = matter(source);
    const validationResult = schema.safeParse(
      parsedSource.data as Record<string, unknown>,
    );

    if (!validationResult.success) {
      console.error("Invalid MDX frontmatter:", validationResult.error);

      return {
        success: false,
        error: "Invalid MDX frontmatter",
      };
    }

    return {
      success: true,
      data: {
        frontmatter: validationResult.data,
        content: parsedSource.content,
      },
    };
  } catch (error) {
    console.error("Failed to serialize MDX source:", error);

    return {
      success: false,
      error: "Failed to serialize MDX source",
    };
  }
}
