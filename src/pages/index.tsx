import Image from 'next/image';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import * as Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import getPrismicClient from '../services/prismic';
// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
// import usuario from '../../public/usuario.png';
// import calendario from '../../public/calendario.png';
import Header from '../components/Header';

type Home = {
  slug: string;
  title: string;
  createdAt: string;
  autor: string;
};
export interface IHomeProps {
  posts?: Home[];
  // postsPagination: {
  //   next_page: string;
  //   results: {
  //     uid: string;
  //     first_publication_date: string;
  //     data: {
  //       title: string;
  //       subtitle: string;
  //       author: string;
  //     };
  //   }[];
  // };
}
// interface Post1 {
//   uid?: string;
//   first_publication_date: string | null;
//   data: {
//     title: string;
//     subtitle: string;
//     autor: string;
//   };
// }

// interface PostPagination {
//   next_page: string;
//   results: {
//     uid: string;
//     first_publication_date: string;
//     data: {
//       title: string;
//       subtitle: string;
//       author: string;
//     }[];
//   };
// }

export default function Home({
  posts,
}: IHomeProps): // { results }: PostPagination
JSX.Element {
  return (
    <>
      <Head>
        <title>Home | Blog Space</title>
      </Head>
      <Header />
      <main className={styles.container}>
        {/* <Image src={logo} className="logo" alt="logo" width={100} height={20} /> */}
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.slug}`} key={post.slug}>
              <a>
                <strong>{post.title}</strong>
                <p>{post.slug}</p>
                <div className={styles.flex}>
                  <time>
                    {' '}
                    <Image
                      src="/calendario.png"
                      className="calendario"
                      alt="calendario"
                      width={20}
                      height={20}
                    />
                    {post.createdAt}
                  </time>
                  <p>
                    {' '}
                    <Image
                      src="/usuario.png"
                      className="usuario"
                      alt="usuario"
                      width={20}
                      height={20}
                    />
                    {post.autor}
                  </p>
                </div>
              </a>
            </Link>
          ))}
          <button type="button" className="carregar">
            Carregar mais posts
          </button>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic?.get({
    predicates: Prismic.predicates.at('document.type', 'publication'),
    fetch: ['publication.title', 'publication.autor'],
    pageSize: 100,
  });

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText([
        { type: 'heading1', text: post.data.title, spans: [] },
      ]),
      createdAt: new Date(post.first_publication_date).toLocaleDateString(
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
