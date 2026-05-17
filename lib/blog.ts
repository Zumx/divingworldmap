import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const DIR = join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export async function listPosts(): Promise<PostMeta[]> {
  let files: string[] = [];
  try {
    files = (await readdir(DIR)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(DIR, file), "utf8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: (data.title as string) || file,
        date: (data.date as string) || "",
        description: (data.description as string) || (data.excerpt as string) || "",
      };
    })
  );
  return posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export async function getPost(slug: string) {
  try {
    const raw = await readFile(join(DIR, `${slug}.mdx`), "utf8");
    const { data, content } = matter(raw);
    return { meta: data as Record<string, string>, content };
  } catch {
    return null;
  }
}
