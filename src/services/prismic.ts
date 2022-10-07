// import * as Prismic from '@prismicio/client';
// import { IncomingMessage } from 'http';

// export function getPrismicClient(
//   req?: IncomingMessage & {
//     cookies: Partial<{
//       [key: string]: string;
//     }>;
//   }
// ): JSX.Element {
//   const prismic = Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
//     ...req,
//     accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//   });
//   return prismic;
// }

import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import { IncomingMessage } from 'http';

export interface PrismicConfig {
  req?: HttpRequestLike;
}
// export function getPrismicClient(req?: IncomingMessage & Config: PrismicConfig): prismic.Client {
export function getPrismicClient(req?: IncomingMessage): prismic.Client {
  const client = prismic.createClient(process.env.PRISMIC_ENDPOINT);

  enableAutoPreviews({
    client,
    ...req,
  });

  return client;
}

// export function getPrismicClient(req?: IncomingMessage, {
//   cookies: Partial<{
//     [key: string]: string;
//   }>;
// }
// ) {
//   const prismic = Prismic.createClient(
//     process.env.PRISMIC_ENDPOINT,
//     {
//       ...req,
//       accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//     }
//   )

//   return prismic;
// }
