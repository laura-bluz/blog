import Image from 'next/image';

import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props: PostPagination): JSX.Element {
  return (
    <>
      <div className={styles.home}>
        <h1>Home</h1>
        <Image src="/public/Logo.svg" alt="logo" width="100px" height="100px" />
        {/* position: absolute;
        width: 238.62px;
        height: 25.63px;
        left: 372px;
        top: 79.55px; */}

        {/* {
          (props.next_page) ?
            <button type="button">Carregar mais posts</button>
        : props.next_page === false
        } */}
      </div>
    </>
  );
}

// export const getStaticProps = async (): JSX.Element => {
//   const prismic = getPrismicClient();
//   const postsResponse = await prismic.getByType();
// };
