import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
// import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import logo from '../../../public/logo.svg';
import banner from '../../../public/Banner.png';
import usuario from '../../../public/usuario.png';
import calendario from '../../../public/calendario.png';
// interface Post {
//   first_publication_date: string | null;
//   data: {
//     title: string;
//     banner: {
//       url: string;
//     };
//     author: string;
//     content: {
//       heading: string;
//       body: {
//         text: string;
//       }[];
//     }[];
//   };
// }

// interface PostProps {
//   post: Post;
// }
interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
    autor: string;
  };
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Head>
        <title>{post.title} | Blog Space</title>
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
        <article className={styles.post}>
          <div className={styles.containerPosts}>
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
            {/* <p>{post.content}</p> */}
            <div
              className={styles.postContent}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: response.data.title,
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutos
  };
};
