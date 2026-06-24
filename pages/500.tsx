import Head from 'next/head';
import { useRouter } from 'next/router';
import { formatPageTitle } from '../src/config/site';
import styles from '../styles/tripplan.module.css';

export default function ServerErrorPage() {
  const router = useRouter();
  return (
    <div className={styles.app}>
      <Head>
        <title>{formatPageTitle('エラーが発生しました')}</title>
      </Head>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚠️</div>
        <p className={styles.emptyText}>エラーが発生しました</p>
        <p className={styles.emptySubText}>しばらく時間をおいてから再度お試しください</p>
        <button
          className={styles.btnPrimary}
          style={{ marginTop: 20 }}
          onClick={() => router.push('/')}
        >
          トップへ戻る
        </button>
      </div>
    </div>
  );
}
