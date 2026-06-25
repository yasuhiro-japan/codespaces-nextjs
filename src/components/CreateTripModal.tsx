import { useState } from 'react';
import { hashPassword } from '../../src/lib/store';
import styles from '../../styles/tripplan.module.css';

const COVER_OPTIONS = ['✈️', '🗺️', '🏔️', '🌊', '🌸', '🍜', '🏯', '🎌', '🌅', '🚂'];

interface TripInput {
  cover: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  passwordHash?: string;
}

interface Props {
  onClose: () => void;
  onCreate: (input: TripInput) => void | Promise<void>;
  initialDestination?: string;
}

export default function CreateTripModal({ onClose, onCreate, initialDestination }: Props) {
  const [form, setForm] = useState<TripInput>({
    cover: '✈️',
    title: '',
    destination: initialDestination ?? '',
    startDate: '',
    endDate: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordsMatch = password === '' || password === confirmPassword;
  const isValid =
    form.title.trim() && form.destination.trim() && form.startDate && form.endDate &&
    form.startDate <= form.endDate && passwordsMatch;

  async function handleSubmit() {
    if (!isValid) return;
    if (password && password !== confirmPassword) {
      setPasswordError('パスワードが一致しません');
      return;
    }
    const ph = password ? await hashPassword(password) : undefined;
    await onCreate({
      cover: form.cover,
      title: form.title.trim(),
      destination: form.destination.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      passwordHash: ph,
    });
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>旅行を作成</h2>

        <p className={styles.iconPickerLabel}>アイコン</p>
        <div className={styles.iconGrid}>
          {COVER_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              className={`${styles.iconBtn} ${form.cover === emoji ? styles.iconBtnActive : ''}`}
              onClick={() => setForm({ ...form, cover: emoji })}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>旅行タイトル</label>
          <input
            className={styles.formInput}
            placeholder="例: 京都・大阪の旅"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>目的地</label>
          <input
            className={styles.formInput}
            placeholder="例: 京都・大阪"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>出発日</label>
            <input
              type="date"
              className={styles.formInput}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>帰宅日</label>
            <input
              type="date"
              className={styles.formInput}
              value={form.endDate}
              min={form.startDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>編集パスワード（任意）</label>
            <input
              type="password"
              className={styles.formInput}
              placeholder="設定しない場合は空白のまま"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>パスワード確認</label>
            <input
              type="password"
              className={styles.formInput}
              placeholder="同じパスワードを入力"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
            />
          </div>
        </div>
        {passwordError && <p className={styles.passwordError}>{passwordError}</p>}
        <p className={styles.passwordHint}>設定するとこの旅行の編集にパスワードが必要になります</p>

        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onClose}>キャンセル</button>
          <button className={styles.btnPrimary} onClick={handleSubmit} disabled={!isValid}>
            旅行を作成
          </button>
        </div>
      </div>
    </div>
  );
}
