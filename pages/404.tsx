import Head from 'next/head';
import { useRouter } from 'next/router';
import { formatPageTitle } from '../src/config/site';
import styles from '../styles/tripplan.module.css';

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className={styles.app}>
      <Head>
        <title>{formatPageTitle('ページが見つかりません')}</title>
      </Head>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🗺️</div>
        <p className={styles.emptyText}>ページが見つかりません</p>
        <p className={styles.emptySubText}>URLをご確認いただくか、トップページに戻ってください</p>
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
