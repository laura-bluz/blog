import Image from 'next/image';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import * as Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../services/prismic';
// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import logo from '../../public/logo.svg';
import usuario from '../../public/usuario.png';
import calendario from '../../public/calendario.png';

type Home = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  autor: string;
};
interface HomeProps {
  posts: Home[];
}
interface Post1 {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    autor: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post1[];
}

// interface HomeProps {
//   postsPagination: PostPagination;
// }

export default function Home({
  posts,
}: HomeProps): // { results }: PostPagination
JSX.Element {
  return (
    <>
      <Head>
        <title>Home | Blog Space</title>
      </Head>

      <main className={styles.container}>
        <Image src={logo} className="logo" alt="logo" width={100} height={20} />
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
              </a>
            </Link>
          ))}
          <button type="button" className="carregar">
            Carregar mais posts
          </button>
        </div>
        {/* <div className={styles.results}>
          {results.map(result => (
            <Link href={`/result/${result.data}`} key={result.uid}>
              <a>
                <strong>{result.data.autor}</strong>
                <time>{result.first_publication_date}</time>
                <p>{result.data.subtitle}</p>
              </a>
            </Link>
          ))}
        </div> */}
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

  //   const results = response.results.map(result => {
  //     return {
  //       uid: result.uid,
  //       first_publication_date: new Date(
  //         result.first_publication_date
  //       ).toLocaleDateString('pt-BR', {
  //         day: '2-digit',
  //         month: 'long',
  //         year: 'numeric',
  //       }),
  //       data: {
  //         title: RichText.asText([
  //           { type: 'heading1', text: result.data.title, spans: [] },
  //         ]),
  //         // subtitle: RichText.asText([
  //         //   { type: 'heading2', text: result.dat, spans: [] },
  //         // ]),
  //         author: RichText.asText([
  //           { type: 'heading3', text: result.data.autor, spans: [] },
  //         ]),
  //       },
  //     };
  // });
  return {
    props: {
      posts,
      //       results,
    },
  };
};

/* {
          (props.next_page) ?
            <button type="button">Carregar mais posts</button>
        : props.next_page === false
        } */

// export const getStaticProps = async (): JSX.Element => {
//   const prismic = getPrismicClient();
//   const postsResponse = await prismic.getByType();
// };
