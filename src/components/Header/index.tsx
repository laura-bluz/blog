import Image from 'next/image';
import Link from 'next/link';

// import logo from '../../../public/Logo.svg';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <>
      <div className={styles.boxLogo}>
        <Link href="/">
          <button type="button">
            <Image
              src="/Logo.svg"
              className={styles.logo}
              alt="logo"
              width={150}
              height={20}
            />
          </button>
        </Link>
      </div>
    </>
  );
}
