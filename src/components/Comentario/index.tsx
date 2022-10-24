import React from 'react';
import styles from './styles.module.scss';

export default function Utterances({
  repo,
  issueTerm = 'pathname',
  label = '',
  theme = 'preferred-color-scheme',
  crossOrigin = 'anonymous',
  async = true,
}): JSX.Element {
  const rootElm = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
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
      utterances.setAttribute(key, value as any);
    });
    // attach script element
    rootElm.current!.appendChild(utterances);
  }, []);

  return (
    <>
      <div className={styles.comentarios} ref={rootElm}>
        {' '}
      </div>
    </>
  );
}
