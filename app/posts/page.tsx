import Link from 'next/link';
import { getAllPostsMeta } from '../../lib/posts';

export const dynamic = 'force-static';

const PINNED_SLUGS = ['writeups'];

export default function PostsPage() {
  const posts = getAllPostsMeta();

  return (
    <>
      <h1 className="h1">All posts</h1>
      <p className="heroSubtitle">CTF writeups, research notes, and technical deep-dives</p>
      <section className="postList">
        {posts.map((p) => (
          <article 
            key={p.slug} 
            className={`postCard${PINNED_SLUGS.includes(p.slug) ? ' pinned' : ''}`}
          >
            <h2 className="postCardTitle">
              <Link href={`/posts/${p.slug}/`}>{p.title}</Link>
            </h2>
            <p className="postCardMeta">
              {p.pubDate ? <span>{p.pubDate}</span> : null}
              {p.description ? <span> · {p.description}</span> : null}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
