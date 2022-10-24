import { createRef, useEffect } from 'react';
import styles from './styles.module.scss';

interface IUtterances {
  repo: string;
  issueTerm?: string;
  label?: string;
  theme?: string;
  crossOrigin?: string;
  async?: boolean;
}

export default function Utterances({
  repo,
  issueTerm = 'pathname',
  label = '',
  theme = 'preferred-color-scheme',
  crossOrigin = 'anonymous',
  async = true,
}: IUtterances): JSX.Element {
  const rootElm = createRef<HTMLDivElement>();

  useEffect(() => {
    const utterances = document.createElement('script');

    // set config to of script element
    Object.entries({
      src: 'https://utteranc.es/client.js',
      repo,
      'issue-term': issueTerm,
      label,
      theme,
      crossOrigin,
      async,
    }).forEach(([key, value]) => {
      utterances.setAttribute(key, value as never);
    });
    // attach script element
    rootElm.current.appendChild(utterances);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.comentarios} ref={rootElm}>
        {' '}
      </div>
    </>
  );
}
