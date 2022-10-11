import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import * as Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import logo from '../../../public/logo.svg';
import banner from '../../../public/Banner.png';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import usuario from '../../../public/usuario.png';
import calendario from '../../../public/calendario.png';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  autor: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Post({ posts }: PostsProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Post | Blog Space</title>
      </Head>
      <div className={styles.boxLogo}>
        <Image
          src={logo}
          className={styles.logo}
          alt="logo"
          width={150}
          height={20}
        />
      </div>
      <main className={styles.container}>
        <div className={styles.banner}>
          <Image
            src={banner}
            alt="banner"
            width="100%"
            height={30}
            layout="responsive"
            objectFit="contain"
          />
        </div>
        <div className={styles.posts}>
          <div className={styles.containerPosts}>
            {posts.map(post => (
              <Link href={`/post/${post.slug}`} key={post.slug}>
                <a>
                  <strong>{post.title}</strong>
                  <div className={styles.flex}>
                    <time>
                      {' '}
                      <Image
                        src={calendario}
                        className="calendario"
                        alt="calendario"
                        width={20}
                        height={20}
                      />
                      {post.updatedAt}
                    </time>
                    <p>
                      {' '}
                      <Image
                        src={usuario}
                        className="usuario"
                        alt="usuario"
                        width={20}
                        height={20}
                      />
                      {post.autor}
                    </p>
                  </div>
                  <p>{post.excerpt}</p>
                </a>
              </Link>
            ))}
          </div>
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
      fetch: ['publication.title', 'publication.content', 'publication.autor'],
      pageSize: 100,
    }
  );

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
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
      autor:
        post.data.autor.find(autor => autor.type === 'paragraph')?.text ?? '',
    };
  });

  return {
    props: {
      posts,
    },
  };
};
