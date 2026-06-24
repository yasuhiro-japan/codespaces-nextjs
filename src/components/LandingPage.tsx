import Head from 'next/head';
import { site } from '../config/site';
import styles from '../../styles/lp.module.css';

interface Props {
  onStart: () => void;
}

const FEATURES = [
  {
    tag: '日程管理',
    icon: '🗓️',
    title: 'スポットを追加して\n日程を組む',
    desc: '訪問スポットを追加するだけで、移動時間を考慮した開始・終了時刻を自動計算。ドラッグ＆ドロップで順番も自由に入れ替えられます。',
  },
  {
    tag: '費用管理',
    icon: '💰',
    title: '費用をスポットごとに\nまとめて記録',
    desc: '交通費・入場料・食費など、スポットごとに最大3件の費用を登録。旅行の総費用をひと目で把握できます。',
  },
  {
    tag: 'URL 共有',
    icon: '🔗',
    title: 'URLひとつで\n仲間と共有',
    desc: '「共有」ボタンを押すだけで読み取り専用のリンクを発行。家族や友人に旅程をすぐシェアできます。',
  },
];

const STEPS = [
  {
    num: 1,
    title: '旅行を作成する',
    desc: 'タイトル・目的地・出発日〜帰宅日を入力するだけで旅程が完成。',
  },
  {
    num: 2,
    title: 'スポットを追加する',
    desc: '訪問したい場所を追加すると、時刻が自動で計算されます。',
  },
  {
    num: 3,
    title: 'URLで仲間に共有',
    desc: 'ワンクリックで共有リンクを発行して、旅程を仲間と共有しましょう。',
  },
];

export default function LandingPage({ onStart }: Props) {
  return (
    <>
      <Head>
        <title>{site.homeTitle}</title>
        <meta name="description" content={site.metaDescription} />
        <meta property="og:title" content={site.name} />
        <meta property="og:description" content={site.metaDescription} />
        <meta property="og:type" content="website" />
      </Head>

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.headerLogo}>{site.badge}</span>
        <button className={styles.headerBtn} onClick={onStart}>旅を計画する →</button>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.badge}>{site.badge}</span>
        <h1 className={styles.heroTitle}>
          旅の日程を、<br />みんなで共有しよう。
        </h1>
        <p className={styles.heroSub}>
          スポット・費用・時間をまとめて管理して、<br />
          URLひとつで仲間と共有できる旅行プランアプリ。
        </p>
        <button className={styles.ctaBtn} onClick={onStart}>旅を計画する →</button>
      </section>

      {/* Features */}
      <section className={styles.features}>
        {FEATURES.map((f, i) => (
          <div key={f.tag} className={`${styles.featureRow}${i % 2 === 1 ? ` ${styles.reverse}` : ''}`}>
            <div className={styles.featureVisual}>
              <span className={styles.featureEmoji}>{f.icon}</span>
              <span className={styles.featureVisualLabel}>{f.tag}</span>
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureTag}>{f.tag}</span>
              <h2 className={styles.featureTitle}>
                {f.title.split('\n').map((line, j) => (
                  <span key={j}>{line}{j === 0 && <br />}</span>
                ))}
              </h2>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className={styles.steps}>
        <div className={styles.stepsInner}>
          <h2 className={styles.stepsHeading}>かんたん3ステップではじめよう</h2>
          <div className={styles.stepGrid}>
            {STEPS.map((s) => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCta}>
        <p className={styles.footerCtaText}>まずは旅を1つ作ってみよう</p>
        <button className={styles.ctaBtn} onClick={onStart}>はじめる →</button>
      </section>
    </>
  );
}
