import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
// import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { RouterContext } from 'react-dom';

import { getPrismicClient } from '../../services/prismic';
import App, { getStaticProps } from '../../pages';

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

interface GetStaticPropsResult {
  props: HomeProps;
}

const mockedGetByTypeReturn = {
  next_page: 'link',
  results: [
    {
      uid: 'codigo-limpo-reflexao-e-pratica',
      first_publication_date: '2022-10-18T09:17:00+0000', // ARRUMAR HORA --------------------------------------------------------------------------------
      data: {
        title: 'Código Limpo: reflexão e prática',
        subtitle: '', // ARRUMAR -----------------------------------------------------------------------
        author: 'Felipe Buzzi',
      },
    },
    {
      uid: 'comunidade-guia-pratico-de-como-contribuir-para-o',
      first_publication_date: '2022-10-11T06:13:00+0000',
      data: {
        title:
          'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia',
        subtitle: '',
        author: 'Felipe Buzzi',
      },
    },
    {
      uid: 'as-principais-licoes-e-dicas-compiladas',
      first_publication_date: '2022-10-17T10:18:00+0000',
      data: {
        title:
          'As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.',
        subtitle: '',
        author: 'Camila Coelho',
      },
    },
  ],
};

jest.mock('@prismicio/client');
jest.mock('../../services/prismic');

const mockedPrismic = getPrismicClient as jest.Mock;
const mockedFetch = jest.spyOn(window, 'fetch') as jest.Mock;
const mockedPush = jest.fn();
let RouterWrapper;

describe('Home', () => {
  beforeAll(() => {
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

    mockedPrismic.mockReturnValue({
      getByType: () => {
        return Promise.resolve(mockedGetByTypeReturn);
      },
    });

    mockedFetch.mockImplementation(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            next_page: null,
            results: [
              {
                uid: 'as-principais-licoes-e-dicas-compiladas',
                first_publication_date: '2022-10-17T10:18:00+0000',
                data: {
                  title:
                    'As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.',
                  subtitle: '',
                  author: 'Camila Coelho',
                },
              },
            ],
          }),
      });
    });
  });

  it('should be able to return prismic posts documents using getStaticProps', async () => {
    const postsPaginationReturn = mockedGetByTypeReturn;

    const getStaticPropsContext: GetStaticPropsContext<ParsedUrlQuery> = {};

    const response = (await getStaticProps(
      getStaticPropsContext
    )) as GetStaticPropsResult;

    expect(response.props.postsPagination.next_page).toEqual(
      postsPaginationReturn.next_page
    );
    expect(response.props.postsPagination.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining(postsPaginationReturn.results[0]),
        expect.objectContaining(postsPaginationReturn.results[1]),
      ])
    );
  });

  it('should be able to render posts documents info', () => {
    const postsPagination = mockedGetByTypeReturn;

    render(<App postsPagination={postsPagination} />);

    screen.getByText(
      'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia'
    );
    screen.getByText(''); // pegar texto do post
    screen.getByText(''); // pegar data
    screen.getByText('Felipe Buzzi');

    screen.getByText(
      'As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.'
    );
    screen.getByText(''); // pegar data
    screen.getByText('Camila Coelho');
  });

  it('should be able to navigate to post page after a click', () => {
    const postsPagination = mockedGetByTypeReturn;

    render(<App postsPagination={postsPagination} />, {
      wrapper: RouterWrapper,
    });

    const firstPostTitle = screen.getByText('Código Limpo: reflexão e prática');
    const secondPostTitle = screen.getByText(
      'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia'
    );

    fireEvent.click(firstPostTitle);
    fireEvent.click(secondPostTitle);

    expect(mockedPush).toHaveBeenNthCalledWith(
      1,
      '/post/codigo-limpo-reflexao-e-pratica',
      expect.anything(),
      expect.anything()
    );
    expect(mockedPush).toHaveBeenNthCalledWith(
      2,
      '/post/comunidade-guia-pratico-de-como-contribuir-para-o',
      expect.anything(),
      expect.anything()
    );
  });

  it('should be able to load more posts if available', async () => {
    const postsPagination = { ...mockedGetByTypeReturn };
    postsPagination.results = [
      {
        uid: 'codigo-limpo-reflexao-e-pratica',
        first_publication_date: '2022-10-18T09:17:00+0000', // ARRUMAR HORA --------------------------------------------------------------------------------
        data: {
          title: 'Código Limpo: reflexão e prática',
          subtitle: '', // ARRUMAR -----------------------------------------------------------------------
          author: 'Felipe Buzzi',
        },
      },
    ];

    render(<App postsPagination={postsPagination} />);

    screen.getByText('Código Limpo: reflexão e prática');
    const loadMorePostsButton = screen.getByText('Carregar mais posts');

    fireEvent.click(loadMorePostsButton);

    await waitFor(
      () => {
        expect(mockedFetch).toHaveBeenCalled();
      },
      { timeout: 200 }
    );

    screen.getByText(
      'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia'
    );
  });

  it('should not be able to load more posts if not available', async () => {
    const postsPagination = mockedGetByTypeReturn;
    postsPagination.next_page = null;

    render(<App postsPagination={postsPagination} />);

    screen.getByText('Código Limpo: reflexão e prática');
    screen.getByText(
      'Comunidade: guia prático de como contribuir para o ecossistema de tecnologia'
    );
    const loadMorePostsButton = screen.queryByText('Carregar mais posts');

    expect(loadMorePostsButton).not.toBeInTheDocument();
  });
});
