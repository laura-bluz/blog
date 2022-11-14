import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Query } from '@prismicio/types';
// import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { RouterContext } from 'react-dom';
import App from 'next/app';
import * as Prismic from '@prismicio/client';
import getPrismicClient from '../../services/prismic';
// import { getStaticProps } from '../../pages/post/[slug]';
import { getStaticProps, IHome } from '../../pages/index';
import Post, {
  IPost,
  // PostProps,
} from '../../pages/post/[slug]';
import { IHomeProps } from '../../pages/index';
import Home from '../../pages/index';

interface IMyProps {
  props: IHomeProps;
}
interface Post {
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
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

interface GetStaticPropsResult {
  props: HomeProps;
}

const mockedGetByTypeReturn = {
  next_page: 'link',
  results: [
    {
      uid: 'codigo-limpo-reflexao-e-pratica',
      first_publication_date: '2022-10-18T20:48:54+0000',
      data: {
        title: 'Código Limpo: reflexão e prática',
        // subtitle: '', //
        author: 'Felipe Buzzi',
      },
    },
    {
      uid: 'comunidade-guia-pratico-de-como-contribuir-para-o',
      first_publication_date: '2022-10-06T17:10:26+0000',
      data: {
        title:
          'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia',
        // subtitle: '',
        author: 'Felipe Buzzi',
      },
    },
    {
      uid: 'as-principais-licoes-e-dicas-compiladas',
      first_publication_date: '2022-10-06T17:08:03+0000',
      data: {
        title:
          'As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.',
        // subtitle: '',
        author: 'Camila Coelho',
      },
    },
  ],
};

const mockedPostByGetStaticProps: IHome[] = [
  {
    slug: 'codigo-limpo-reflexao-e-pratica',
    title: 'Código Limpo: reflexão e prática',
    createdAt: '18 de outubro de 2022',
    autor: 'Felipe Buzzi',
  },
];

jest.mock('@prismicio/client');
// const prismicT = getPrismicClient();
// const mockedPrismic = prismicT.get() as jest.Fn;
const mockedFetch = jest.spyOn(window, 'fetch') as jest.Mock;
const mockedPush = jest.fn();
// jest.mock('../../services/prismic', () => {

jest.mock('../../services/prismic');

const response2 = {
  results: [
    {
      uid: 'codigo-limpo-reflexao-e-pratica',
      first_publication_date: '2022-10-06T20:08:03+0000',
      data: {
        title: 'Código Limpo: reflexão e prática',
        autor: [{ type: 'paragraph', text: 'Felipe Buzzi' }],
      },
    },
    {
      uid: 'comunidade-guia-pratico-de-como-contribuir-para-o',
      first_publication_date: '2022-10-06T17:10:26+0000',
      data: {
        title:
          'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia',
        autor: [{ type: 'paragraph', text: 'Felipe Buzzi' }],
      },
    },
    {
      uid: 'as-principais-licoes-e-dicas-compiladas',
      first_publication_date: '2022-10-06T17:08:03+0000',
      data: {
        title:
          'As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.',
        autor: [{ type: 'paragraph', text: 'Camila Coelho' }],
      },
    },
  ],
};
const get = (): any => response2;

// });
// const mockedQuery = getPrismicClient().query as jest.Mock;
// const teste = {
//   query: () => [],
// };
// const mockPrismic = (): any => {
//   return teste;
// };
// jest.mock('../../services/prismic', () => {
//   return () => mockPrismic;
// });
// import { getPrismicClient } from '../services/prismic';
let RouterWrapper;
// const teste2 = { results: [] };
describe('Home', () => {
  beforeAll(() => {
    (getPrismicClient as jest.Mock).mockImplementation(() => {
      return { get };
    });
    // mockedPrismic.mockImplementation(() => {
    //   return {
    //     get: () => teste2,
    //   };
    // });
    // (mockedPrismic().get as jest.Mock).mockImplementation(() => {
    //   return teste2;
    //   // (mockedQuery as jest.Mock).mockReturnValue([]);
    // });

    mockedPush.mockImplementation(() => Promise.resolve());
    const MockedRouterContext = RouterContext as React.Context<unknown>;
    RouterWrapper = ({ children }): JSX.Element => {
      return (
        <MockedRouterContext.Provider
          value={{
            push: mockedPush,
          }}
        >
          {children}
        </MockedRouterContext.Provider>
      );
    };

    // mockedPrismic.mockReturnValue({
    //   getByType: () => {
    //     return Promise.resolve(mockedGetByTypeReturn);
    //   },
    // });

    mockedFetch.mockImplementation(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            next_page: null,
            results: [
              {
                uid: 'as-principais-licoes-e-dicas-compiladas',
                first_publication_date: '2022-10-06T17:08:03+0000',
                data: {
                  title:
                    'As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.',
                  author: 'Camila Coelho',
                },
              },
            ],
          }),
      });
    });
  });

  it('should be able to return prismic posts documents using getStaticProps', async () => {
    // const postsPaginationReturn = mockedGetByTypeReturn;

    const getStaticPropsContext: GetStaticPropsContext<ParsedUrlQuery> = {};

    const response = (await getStaticProps(getStaticPropsContext)) as IMyProps;

    expect(response.props.posts[0].title).toEqual(
      'Código Limpo: reflexão e prática'
    );

    expect(response.props.posts[1].slug).toEqual(
      'comunidade-guia-pratico-de-como-contribuir-para-o'
    );

    expect(response.props.posts[2].autor).toEqual('Camila Coelho');

    // expect(response.props);
    // expect(response.props.postsPagination.next_page).toEqual(
    //   postsPaginationReturn.next_page
    // );

    // expect(response.props.postsPagination.results).toEqual(
    //   expect.arrayContaining([
    //     expect.objectContaining(postsPaginationReturn.results[0]),
    //     expect.objectContaining(postsPaginationReturn.results[1]),
    //   ])
    // );
  });

  it('should be able to render posts documents info', () => {
    // const postsPagination = mockedGetByTypeReturn;

    // render(<App postsPagination={postsPagination} />);
    const postProps = mockedPostByGetStaticProps;

    render(<Home posts={postProps} />);

    screen.getByText('Código Limpo: reflexão e prática');
    screen.getByText('18 de outubro de 2022');
    screen.getByText('Felipe Buzzi');
  });

  // it('should be able to navigate to post page after a click', () => {
  //   const postsPagination = mockedGetByTypeReturn;

  //   render(<App postsPagination={postsPagination} />, {
  //     wrapper: RouterWrapper,
  //   });

  //   const firstPostTitle = screen.getByText('Código Limpo: reflexão e prática');
  //   const secondPostTitle = screen.getByText(
  //     'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia'
  //   );

  //   fireEvent.click(firstPostTitle);
  //   fireEvent.click(secondPostTitle);

  //   expect(mockedPush).toHaveBeenNthCalledWith(
  //     1,
  //     '/post/codigo-limpo-reflexao-e-pratica',
  //     expect.anything(),
  //     expect.anything()
  //   );
  //   expect(mockedPush).toHaveBeenNthCalledWith(
  //     2,
  //     '/post/comunidade-guia-pratico-de-como-contribuir-para-o',
  //     expect.anything(),
  //     expect.anything()
  //   );
  // });

  // it('should be able to load more posts if available', async () => {
  //   const postsPagination = { ...mockedGetByTypeReturn };
  //   postsPagination.results = [
  //     {
  //       uid: 'codigo-limpo-reflexao-e-pratica',
  //       first_publication_date: '2022-10-18T20:48:54+0000',
  //       data: {
  //         title: 'Código Limpo: reflexão e prática',
  //         // subtitle: '', //
  //         author: 'Felipe Buzzi',
  //       },
  //     },
  //   ];

  //   render(<App postsPagination={postsPagination} />);

  //   screen.getByText('Código Limpo: reflexão e prática');
  //   const loadMorePostsButton = screen.getByText('Carregar mais posts');

  //   fireEvent.click(loadMorePostsButton);

  //   await waitFor(
  //     () => {
  //       expect(mockedFetch).toHaveBeenCalled();
  //     },
  //     { timeout: 200 }
  //   );

  //   screen.getByText(
  //     'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia'
  //   );
  // });

  // it('should not be able to load more posts if not available', async () => {
  //   const postsPagination = mockedGetByTypeReturn;
  //   postsPagination.next_page = null;

  //   render(<App postsPagination={postsPagination} />);

  //   screen.getByText('Código Limpo: reflexão e prática');
  //   screen.getByText(
  //     'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia'
  //   );
  //   const loadMorePostsButton = screen.queryByText('Carregar mais posts');

  //   expect(loadMorePostsButton).not.toBeInTheDocument();
  // });
});
