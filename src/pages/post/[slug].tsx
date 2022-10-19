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
import * as Prismic from '@prismicio/client';
import { PrismicDocument } from '@prismicio/types';
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
  anterior: PrismicDocument<Record<string, any>, string, string>;
  proximo: PrismicDocument<Record<string, any>, string, string>;
}
const linkResolver = doc => {
  return '/' + doc.uid;
};
export default function Post({
  post,
  anterior,
  proximo,
}: PostProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Blog Space | {post.title}</title>
      </Head>

      <Header />

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
          {anterior ? (
            <div className={styles.alignFilhos}>
              <p>{anterior?.data?.title}</p>
              <Link href={`/post/${anterior?.uid}`}>
                <button type="button" className="carregar">
                  Post anterior
                </button>
              </Link>
            </div>
          ) : (
            <div></div>
          )}
          {proximo ? (
            <div className={styles.alignFilhos}>
              <div>{proximo?.data?.title}</div>
              <Link href={`/post/${proximo?.uid}`}>
                <button type="button" className="carregar">
                  Próximo post
                </button>
              </Link>
            </div>
          ) : (
            <div></div>
          )}
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

  const prismic = getPrismicClient();

  const doc = await prismic.getByUID('publication', String(slug), {});
  console.log('doc', doc.data.content);
  const texto = RichText.asText(doc.data.content).split(/\s+/);

  const tempoLeitura = Math.ceil(texto.length / 200);

  const post = {
    slug,
    title: doc.data.title,
    content: RichText.asHtml(doc.data.content.splice(0, 3)),
    createdAt: new Date(doc.first_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
    updatedAt: new Date(doc.last_publication_date).toLocaleTimeString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    autor: doc.data.autor.find(autor => autor.type === 'paragraph')?.text ?? '',
    tempoLeitura: tempoLeitura.toString().concat('min'),
  };

  const proximoPost = await prismic.query(
    Prismic.Predicates.at('document.type', 'publication'),
    {
      pageSize: 1,
      after: doc?.id,
      orderings: ['document.first_publication_date desc'],
    }
  );
  const anteriorPost = await prismic.query(
    Prismic.Predicates.at('document.type', 'publication'),
    {
      pageSize: 1,
      after: doc?.id,
      orderings: ['document.first_publication_date'],
    }
  );
  const proximo = proximoPost?.results[0] || null;
  const anterior = anteriorPost?.results[0] || null;

  return {
    props: {
      post,
      proximo,
      anterior,
    },
    redirect: 60 * 30, // 30 minutos
  };
};
