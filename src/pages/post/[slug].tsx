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
import relogio from '../../../public/relogio.png';
import Header from '../../components/Header';
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
    tempoLeitura: string;
  };
}

export default function Post({ post }: PostProps): JSX.Element {
  // console.log(RichText.asHtml(post.content));

  return (
    <>
      <Head>
        <title>{post.title} | Blog Space</title>
      </Head>

      <Header />
      {/* <div className={styles.boxLogo}>
        <Image
          src={logo}
          className={styles.logo}
          alt="logo"
          width={150}
          height={20}
        />
      </div> */}
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
        <article className={styles.posts}>
          <div className={styles.containerPosts}>
            <p className={styles.title}>{post.title}</p>
            <div className={styles.flex}>
              <time>
                {' '}
                <Image
                  src={calendario}
                  alt="calendario"
                  width={20}
                  height={20}
                />
                {post.updatedAt}
              </time>
              <p className={styles.autor}>
                {' '}
                <Image src={usuario} alt="usuario" width={20} height={20} />
                {post.autor}
              </p>
              <p>
                <Image src={relogio} alt="relogio" width={20} height={20} />
                {post.tempoLeitura}
              </p>
            </div>
            {/* <p>{post.content}</p> */}
            <div
              className={styles.content}
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
  const texto = RichText.asText(response.data.content).split(/\s+/);

  const tempoLeitura = Math.ceil(texto.length / 200);

  console.log('tempo', tempoLeitura);
  console.log('tamanho', texto.length);
  console.log(RichText.asText(response.data.content));
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
    autor:
      response.data.autor.find(autor => autor.type === 'paragraph')?.text ?? '',
    tempoLeitura: tempoLeitura.toString().concat('min'),
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutos
  };
};
