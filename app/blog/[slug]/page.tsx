import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import SiteNav from "@/components/SiteNav";
import { listPosts, getPost } from "@/lib/blog";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title || slug,
    description: post.meta.description || post.meta.excerpt || undefined,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "3.5rem 2rem 5rem" }}>
        <nav style={{ display: "flex", gap: "1.2rem", fontFamily: "var(--font-sans)", fontSize: "0.85rem", marginBottom: "2rem" }}>
          <Link href="/blog" style={{ color: "var(--c-primary)", fontWeight: 600, textDecoration: "none" }}>← All posts</Link>
          <Link href="/map" style={{ color: "var(--c-primary)", fontWeight: 600, textDecoration: "none" }}>Map</Link>
        </nav>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.9rem,4.5vw,2.8rem)", color: "var(--c-primary)", marginBottom: "0.5rem" }}>
          {post.meta.title || slug}
        </h1>
        {post.meta.date && (
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "var(--c-mute)", marginBottom: "2rem" }}>
            {post.meta.date}
          </div>
        )}
        <article className="wm-prose" style={{ fontFamily: "var(--font-sans)", fontSize: "1.02rem", lineHeight: 1.75, color: "var(--c-ink)" }}>
          <MDXRemote source={post.content} />
        </article>
        <nav style={{ display: "flex", gap: "1.2rem", fontFamily: "var(--font-sans)", fontSize: "0.85rem", marginTop: "3rem", borderTop: "1px solid var(--c-line)", paddingTop: "1.5rem" }}>
          <Link href="/blog" style={{ color: "var(--c-primary)", fontWeight: 600, textDecoration: "none" }}>← All posts</Link>
          <Link href="/map" style={{ color: "var(--c-primary)", fontWeight: 600, textDecoration: "none" }}>Explore the map →</Link>
        </nav>
      </main>
    </div>
  );
}
