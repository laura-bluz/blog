import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import * as Prismic from '@prismicio/client';

import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Post({ posts }: PostsProps): JSX.Element {
  return (
    <>
      <Head>
        <Image src="/public/Logo.svg" alt="logo" width="100px" height="100px" />
        <title>Blog Space</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'publication'),
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
    }
  );

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      // title: post.data.title,
      title: RichText.asText([
        { type: 'heading1', text: post.data.title, spans: [] },
      ]),
      excerpt:
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
