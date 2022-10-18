import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
// import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import logo from '../../../public/Logo.svg';
import banner from '../../../public/Banner.png';
import usuario from '../../../public/usuario.png';
import calendario from '../../../public/calendario.png';
import relogio from '../../../public/relogio.png';
import Header from '../../components/Header';
import React from 'react';
import Utterances from '../../components/Comentario';
import { useRouter } from 'next/router';
import { title } from 'process';
import Link from 'next/link';

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
    createdAt: string;
    autor: string;
    tempoLeitura: string;
  };
}

export default function Post({ post }: PostProps): JSX.Element {
  // console.log(RichText.asHtml(post.content));
  const router = useRouter();
  const query = router.query;
  console.log('queryLaura', query);
  return (
    <>
      <Head>
        <title>Blog Space | {post.title}</title>
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
                {post.createdAt}
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
            <p className={styles.editado}>*editado em {post.updatedAt}</p>
            <div
              className={styles.content}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
        <div className={styles.linha}></div>
        <div className={styles.align}>
          <div className={styles.hooks}>
            {query.titleAnterior}
            <Link href={`/post/${query.anterior}`}>
              {/* fazer com estado */}
              <button type="button" className="carregar">
                Post anterior
              </button>
            </Link>
          </div>
          <div className={styles.proximosHooks}>
            <p>Próximo post</p>
            <button type="button" className="carregar">
              Próximo post
            </button>
          </div>
        </div>
        <br></br>
      </main>

      <Utterances repo="laura-bluz/blog"></Utterances>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async context => {
  // console.log('contextttttt', context);
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  // console.log('params', context);
  // console.log('cont', context)
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('publication', String(slug), {});
  const texto = RichText.asText(response.data.content).split(/\s+/);

  const tempoLeitura = Math.ceil(texto.length / 200);

  // console.log('tempo', tempoLeitura);
  // console.log('tamanho', texto.length);
  // console.log(RichText.asText(response.data.content));
  const post = {
    slug,
    title: response.data.title,
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    createdAt: new Date(response.first_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
    updatedAt: new Date(response.last_publication_date).toLocaleTimeString(
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

// username/repo format
// const REPO_NAME = 'laura-bluz/blog';

// export const useUtterances = (commentNodeId: string, theme: string) => {
//   React.useEffect(() => {
//     const scriptParentNode = document.getElementById(commentNodeId);
//     if (!scriptParentNode) return;

//     // docs - https://utteranc.es/
//     const script = document.createElement('script');
//     script.src = 'https://utteranc.es/client.js';
//     script.async = true;
//     script.setAttribute('repo', REPO_NAME);
//     script.setAttribute('issue-term', 'pathname');
//     // script.setAttribute('label', 'comment :speech_balloon:');
//     // scriptElem.setAttribute('label', 'blog-comment');
//     script.setAttribute('label', 'blog-comment');
//     script.setAttribute('theme', 'github-light');
//     // script.setAttribute('crossOrigin', 'anonymous');
//     // scriptElem.crossOrigin = 'anonymous';
//     script.crossOrigin = 'anonymous';
//     scriptParentNode.appendChild(script);

//     return () => {
//       // cleanup - remove the older script with previous theme
//       scriptParentNode.removeChild(scriptParentNode.firstChild as Node);
//     };
//   }, [commentNodeId]);
// };

// const Wrapper = styled.div`
//   width: 100%;
//   padding: 1rem;
//   .utterances {
//     max-width: 77rem;
//   }
// `;

// export const UtterancesComments: React.FC = () => (
//   <section
//     ref={elem => {
//       if (!elem) {
//         return;
//       }
//       const scriptElem = document.createElement('script');
//       scriptElem.src = 'https://utteranc.es/client.js';
//       scriptElem.async = true;
//       scriptElem.crossOrigin = 'anonymous';
//       scriptElem.setAttribute('repo', 'laura-bluz/blog');
//       scriptElem.setAttribute('issue-term', 'pathname');
//       scriptElem.setAttribute('label', 'blog-comment');
//       scriptElem.setAttribute('theme', 'github-light');
//       elem.appendChild(scriptElem);
//     }}
//   />
// );
