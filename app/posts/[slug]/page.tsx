import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllSlugs, getPostBySlug } from '../../../lib/posts';
import { markdownToHtml } from '../../../lib/markdown';

export const dynamic = 'force-static';

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description
    };
  } catch {
    return { title: 'Not found' };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (() => {
    try {
      return getPostBySlug(slug);
    } catch {
      notFound();
    }
  })();

  const html = await markdownToHtml(post.content);

  return (
    <article>
      <h1 className="h1">{post.title}</h1>
      <p className="meta">
        {post.pubDate ? <span>{post.pubDate}</span> : null}
        {post.description ? <span> · {post.description}</span> : null}
      </p>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
