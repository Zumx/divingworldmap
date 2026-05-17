import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { site } from "@/lib/site";
import { listPosts } from "@/lib/blog";

export const revalidate = 3600;

export const metadata = {
  title: `Blog — Guides & Top 10s | ${site.name}`,
  description: `Guides, top-10 lists and trip-planning advice from ${site.name}.`,
};

export default async function BlogIndex() {
  const posts = await listPosts();
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "4rem 2rem" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--c-accent)", marginBottom: "0.8rem" }}>
          {site.heroKicker}
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,3rem)", color: "var(--c-primary)", marginBottom: "0.6rem" }}>
          Blog
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", color: "var(--c-warm)", marginBottom: "2.5rem" }}>
          Guides, top-10 lists and trip-planning advice — every place mentioned is on the{" "}
          <Link href="/map" style={{ color: "var(--c-primary)" }}>interactive map</Link>.
        </p>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul style={{ listStyle: "none", display: "grid", gap: "1rem" }}>
            {posts.map((post) => (
              <li key={post.slug} className="wm-card" style={{ padding: "1.3rem 1.5rem" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", margin: 0 }}>
                  <Link href={`/blog/${post.slug}`} style={{ color: "var(--c-ink)", textDecoration: "none" }}>
                    {post.title}
                  </Link>
                </h2>
                {post.date && (
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--c-mute)", margin: "0.4rem 0" }}>
                    {post.date}
                  </div>
                )}
                {post.description && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.92rem", color: "var(--c-warm)", margin: "0.4rem 0 0.8rem" }}>
                    {post.description}
                  </p>
                )}
                <Link href={`/blog/${post.slug}`} style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 600, color: "var(--c-primary)", textDecoration: "none" }}>
                  Read more →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
