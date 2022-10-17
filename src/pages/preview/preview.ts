// import { Document } from '@prismicio/client/types/documents';
import Document from '@prismicio/client';
import { GetServerSideProps } from 'next';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
    autor: string;
  };
}

function linkResolver(doc: Document): string {
  if (doc.contentType === 'posts') {
    return `/post/${doc.getElementById}`;
  }
  return '/';
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params;

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: response.data.title,
    content: RichText.asHtml(response.data.content),
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
  };

  return {
    props: {
      post,
    },
  };
};

// ARRUMAR
