import { render, screen } from '@testing-library/react';

import {
  // GetStaticPropsContext,
  GetStaticPathsContext,
  GetStaticPathsResult,
} from 'next';

import { useRouter } from 'next/router';
import getPrismicClient from '../../services/prismic';
import Post, {
  IPost,
  // PostProps,
} from '../../pages/post/[slug]';

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
//       body: Record<string, unknown>[];
//     }[];
//   };
// }

// interface PostProps {
//   post: Post;
// }

// interface GetStaticPropsResult {
//   props: PostProps;
// }

const mockedGetByTypeReturn = {
  results: [
    {
      uid: 'codigo-limpo-reflexao-e-pratica',
    },
    {
      uid: 'comunidade-guia-pratico-de-como-contribuir-para-o',
    },
  ],
};

const mockedGetAllByTypeReturn = [
  {
    uid: 'codigo-limpo-reflexao-e-pratica',
  },
  {
    uid: 'comunidade-guia-pratico-de-como-contribuir-para-o',
  },
];

const mockedPostByGetStaticProps: IPost = {
  slug: 'codigo-limpo-reflexao-e-pratica',
  title: 'Código Limpo: reflexão e prática',
  content:
    '<h3><strong>Um conjunto de filosofias extremamente importantes e populares ' +
    'no ecossistema</strong></h3><p></p><p> Desenvolvimento de software possui ' +
    'diversas bases teóricas que definem o comportamento da programação e ajudam a ' +
    'padronizar métodos de criação. Os livros possuem um papel fundamental para a compreensão ' +
    'dessas bases, eles estão localizados no que definimos de <strong>“tempo da reflexão”</strong>, ' +
    'um pouco distantes do <strong>“tempo da prática”</strong>. Os princípios do Código Limpo fazem parte de ' +
    'um conjunto de filosofias extremamente importantes e populares no ecossistema. No entanto, principalmente entre iniciantes, ' +
    'ainda existem dúvidas sobre o que é, afinal, um “código limpo” e o que ele representa na prática e na lógica do mercado.<br />' +
    '<strong>Robert C. Martin<br /></strong>Robert C. Martin escreveu o livro “Clean Code” em 2009, um pouco antes da virada da década, ' +
    'e desde então serve como referencial fundamental para a consolidação de novos projetos que surgiram entre 2010 e 2020.<br />' +
    'Além de ter uma bibliografia referente na área, Robert foi um dos co-autores do manifesto ágil. Ele também definiu os cinco princípios de design ' +
    '<a  href="https://sites.google.com/site/unclebobconsultingllc/getting-a-solid-start">SOLID</a>, com o objetivo de tornar o desenvolvimento de ' +
    'software mais compreensível, flexível e sustentável.<br />Com uma extensa carreira no desenvolvimento de códigos, Robert se dedica em unir os dois tempos, ' +
    'reflexão e prática, para contribuir na qualidade de vida dos programadores e usuários, aproximando a tecnologia com interesses humanos.<br /><strong> ' +
    'Não há regras, nem leis, nem manuais<br /></strong>O desafio aqui é me propor a explicar para você o que é código limpo da maneira mais objetiva possível, ' +
    'sem deixar confusões e, no mínimo, alimentar a sua curiosidade em saber mais sobre o assunto.<br />E eu confesso que já comecei errado: “clean code” ' +
    'é uma ideia subjetiva reunida com base em princípios de boas práticas, ou seja, não há características definitivas.<br />Não há regras, nem leis, ' +
    'nem manuais. No entanto, há pistas que podemos encontrar, entre estudos de erros e acertos, do que pode ser considerado um exemplo de código limpo.<br /> ' +
    '<strong>Prosa elegante e eficaz<br /></strong>Para definir o que é Código Limpo,<a  href="https://youtu.be/7EmboKQH8lM"> nessa palestra disponível ' +
    'no YouTube</a>, Robert cita alguns programadores reconhecidos pela comunidade. <a  href="https://pt.wikipedia.org/wiki/Grady_Booch">Grady Booch</a> ' +
    'define:<br /><em>“código limpo é simples e direto. Código limpo é lido como uma prosa bem escrita”</em>.<br />Booch é um dos teóricos responsáveis ' +
    'em criar os fundamentos de projetos orientados a objetos, e abriu portas para novas metodologias de desenvolvimento colaborativo.<br />A sua definição ' +
    'sobre código limpo está conectada à legibilidade do código, cujo deve ser lido e apreciado como prosa ' +
    'literária.<br /><a  href="https://pt.wikipedia.org/wiki/Bjarne_Stroustrup">Bjarne Stroustrup</a>, criador do C++, apresenta uma definição um pouco ' +
    'mais objetiva e reflexiva na prática:<br /><em>“Eu gosto que meu código seja elegante e eficiente… uma coisa o código limpo faz ' +
    'bem”.<br /></em><strong><em></em>Adeus, clean code<br /></strong>O programador Dan Abramov, um dos desenvolvedores do núcleo React, no Facebook, ' +
    'escreveu um artigo provocando o conceito de clean code e sobre a busca, quase obcecada, de muitos programadores pelo código elegante.<br />Você pode ' +
    'conferir o artigo <a  href="https://overreacted.io/goodbye-clean-code/">aqui</a>. Nas palavras de Dan, “código limpo não é um objetivo. É uma ' +
    'tentativa de buscar sentido nessa imensa complexidade de sistemas que estamos lidando”.<br />Como vocês podem reparar, unir consenso e fechar ' +
    'o conceito numa frase única, objetiva, definitiva, pode gerar uma série de problemas, já que a tecnologia é movida por resultados e subjetividades ' +
    'humanas.<br /><strong>Reflexão carinhosa sobre boas práticas<br /></strong>Para compreender o que é código limpo basta observar e refletir com atenção ' +
    '— e carinho — suas boas práticas. Muitos profissionais da área eventualmente vão passar por um momento de reflexão e observar seus princípios — com suas ' +
    'respectivas subjetividades e objetivos em mente.<br />Concordamos que pode ser um passo fundamental para quem precisa expandir novas rotas dentro da programação ' +
    'e compreender melhor a fluidez do conhecimento e da tecnologia.<br />Em 2015, bem no começo do canal, o Filipe Deschamps fez um vídeo para comentar a ' +
    'sua leitura sobre “Código Limpo” e pontuar os princípios da filosofia.</p>',
  createdAt: '18 de outubro de 2022',
  updatedAt: '18 de outubro de 2022 21:17:40',
  autor: 'Felipe Buzzi',
  tempoLeitura: '4min',
};

jest.mock('@prismicio/client');
jest.mock('../../services/prismic');
// jest.mock('next/router');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
const mockedUseRouter = useRouter as jest.Mock;
const mockedPrismic = getPrismicClient as jest.Mock;

describe('Post', () => {
  beforeAll(() => {
    mockedUseRouter.mockReturnValue({
      isFallback: false,
    });

    mockedPrismic.mockReturnValue({
      // getByUID: () => {
      //   return Promise.resolve(mockedGetByUIDReturn);
      // },
      getAllByType: () => {
        return Promise.resolve(mockedGetAllByTypeReturn);
      },
      getByType: () => {
        return Promise.resolve(mockedGetByTypeReturn);
      },
    });
  });

  // it('should be able to return prismic posts documents paths using getStaticPaths', async () => {
  //   const getStaticPathsReturn = [
  //     {
  //       params: {
  //         slug: 'codigo-limpo-reflexao-e-pratica',
  //       },
  //     },
  //     {
  //       params: {
  //         slug: 'comunidade-guia-pratico-de-como-contribuir-para-o',
  //       },
  //     },
  //   ];

  //   const getStaticPathsContext: GetStaticPathsContext = {};

  //   const response = (await getStaticPaths(
  //     getStaticPathsContext
  //   )) as GetStaticPathsResult;

  //   expect(response.paths).toEqual(getStaticPathsReturn);
  // });

  // it('should be able to return prismic post document using getStaticProps', async () => {
  //   const routeParam = parse('codigo-limpo-reflexao-e-praticas');

  //   const postReturn = mockedGetByUIDReturn;
  //   const getStaticPropsContext: GetStaticPropsContext<ParsedUrlQuery> = {
  //     params: routeParam,
  //   };

  //   const response = (await getStaticProps(
  //     getStaticPropsContext
  //   )) as GetStaticPropsResult;

  //   expect(response.props.post).toEqual(expect.objectContaining(postReturn));
  // });

  it('should be able to render post document info', () => {
    const postProps = mockedPostByGetStaticProps;

    render(<Post post={postProps} />);

    screen.getByText('Código Limpo: reflexão e prática');
    screen.getByText('18 de outubro de 2022');
    screen.getByText('Felipe Buzzi');
    screen.getByText('4min');

    screen.getByText('Não há regras, nem leis, nem manuais');
    // screen.getByText(
    //   'No entanto, há pistas que podemos encontrar, entre estudos de erros e acertos,'
    // );
    screen.getByText('“tempo da prática”');
  });

  // it('should be able to render loading message if fallback', () => {
  //   mockedUseRouter.mockReturnValueOnce({
  //     isFallback: true,
  //   });

  //   const postProps = mockedGetByTypeReturn;

  //   render(<Post post={postProps} />);

  //   screen.getByText('Carregando...');
  // });
});
