import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { site } from '../config/site';
import styles from '../../styles/lp.module.css';

interface Props {
  onStart: (destination?: string) => void;
}

const QUICK_DESTINATIONS = [
  { emoji: '🏯', name: '京都' },
  { emoji: '🗼', name: '東京' },
  { emoji: '🌺', name: '沖縄' },
  { emoji: '🏙️', name: '大阪' },
  { emoji: '🌸', name: '北海道' },
];

function ScheduleMockup() {
  const spots = [
    { time: '09:00', name: '金閣寺', cat: '観光' },
    { time: '10:30', name: '嵐山竹林', cat: '観光' },
    { time: '12:00', name: '湯豆腐 嵯峨野', cat: '食事' },
  ];
  return (
    <div className={styles.mockup}>
      {spots.map((s) => (
        <div key={s.name} className={styles.mockupSpot}>
          <span className={styles.mockupTime}>{s.time}</span>
          <div className={styles.mockupSpotInfo}>
            <span className={styles.mockupSpotName}>{s.name}</span>
            <span className={styles.mockupSpotCat}>{s.cat}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CostMockup() {
  const costs = [
    { label: '入場料', amount: '¥500' },
    { label: '交通費', amount: '¥350' },
    { label: '食費', amount: '¥1,200' },
  ];
  return (
    <div className={styles.mockup}>
      {costs.map((c) => (
        <div key={c.label} className={styles.mockupCostRow}>
          <span className={styles.mockupCostLabel}>{c.label}</span>
          <span className={styles.mockupCostAmount}>{c.amount}</span>
        </div>
      ))}
      <div className={styles.mockupCostTotal}>
        <span>合計</span>
        <span>¥2,050</span>
      </div>
    </div>
  );
}

function ShareMockup() {
  return (
    <div className={styles.mockup}>
      <p className={styles.mockupShareLabel}>共有リンク</p>
      <div className={styles.mockupShareUrl}>tripplan.app/share/abc123</div>
      <div className={styles.mockupShareBtn}>リンクをコピー</div>
    </div>
  );
}

const FEATURES = [
  {
    tag: '日程管理',
    mockup: <ScheduleMockup />,
    title: 'スポットを追加して\n日程を組む',
    desc: '訪問スポットを追加するだけで、移動時間を考慮した開始・終了時刻を自動計算。ドラッグ＆ドロップで順番も自由に入れ替えられます。',
  },
  {
    tag: '費用管理',
    mockup: <CostMockup />,
    title: '費用をスポットごとに\nまとめて記録',
    desc: '交通費・入場料・食費など、スポットごとに最大3件の費用を登録。旅行の総費用をひと目で把握できます。',
  },
  {
    tag: 'URL 共有',
    mockup: <ShareMockup />,
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
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle(styles.visible, e.isIntersecting)),
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>{site.homeTitle}</title>
        <meta name="description" content={site.metaDescription} />
        <meta property="og:title" content={site.name} />
        <meta property="og:description" content={site.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={site.name} />
        <meta name="twitter:description" content={site.metaDescription} />
        <meta name="twitter:image" content="/og-image.svg" />
      </Head>

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.headerLogo}>{site.badge}</span>
        <button className={styles.headerBtn} onClick={() => onStart()}>旅を計画する →</button>
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
        <button className={styles.ctaBtn} onClick={() => onStart()}>無料でプランを作る →</button>
        <p className={styles.heroBadge}>✓ 無料 &nbsp;·&nbsp; 登録不要 &nbsp;·&nbsp; データはブラウザに保存</p>
        <div className={styles.quickDestinations}>
          <span className={styles.quickDestLabel}>よく使われる旅先</span>
          <div className={styles.quickDestChips}>
            {QUICK_DESTINATIONS.map((d) => (
              <button key={d.name} className={styles.destChip} onClick={() => onStart(d.name)}>
                {d.emoji} {d.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        {FEATURES.map((f, i) => (
          <div
            key={f.tag}
            ref={(el) => { fadeRefs.current[i] = el; }}
            className={`${styles.featureRow}${i % 2 === 1 ? ` ${styles.reverse}` : ''} ${styles.fadeIn}`}
          >
            <div className={styles.featureVisual}>
              {f.mockup}
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
      <section ref={(el) => { fadeRefs.current[3] = el; }} className={`${styles.steps} ${styles.fadeIn}`}>
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
      <section ref={(el) => { fadeRefs.current[4] = el; }} className={`${styles.footerCta} ${styles.fadeIn}`}>
        <p className={styles.footerCtaText}>まずは旅を1つ作ってみよう</p>
        <button className={styles.ctaBtn} onClick={() => onStart()}>無料ではじめる →</button>
        <p className={styles.heroBadge}>✓ 無料 &nbsp;·&nbsp; 登録不要</p>
      </section>
    </>
  );
}
