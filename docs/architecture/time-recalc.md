# 時刻再計算ロジック（recalcTimes）

## 概要

スポットの追加・削除・ドラッグ&ドロップ並び替えが行われた後、
その日のスポット全体の開始時刻を連鎖的に再計算する。

実装は `src/lib/recalcTimes.ts` に配置する。

---

## 関数シグネチャ

```typescript
function recalcTimes(spots: Spot[]): Spot[]
```

- **入力**: 並び替え済みの Spot 配列（新しい順序）
- **出力**: 全スポットの `startTime` を再計算した新しい Spot 配列
- **副作用なし**: 入力配列を直接変更せず、新しい配列を返す

---

## 計算ルール

1. **先頭スポット（index 0）の `startTime` はそのまま保持**する
2. 2番目以降の各スポットの `startTime`:

   ```
   spots[i].startTime = spots[i-1].startTime + spots[i-1].duration（分）
   ```

3. この計算をリストの末尾まで連鎖的に適用する

---

## 実装例

```typescript
function recalcTimes(spots: Spot[]): Spot[] {
  if (spots.length === 0) return [];
  const result = [...spots];
  for (let i = 1; i < result.length; i++) {
    result[i] = {
      ...result[i],
      startTime: addMinutes(result[i - 1].startTime, result[i - 1].duration),
    };
  }
  return result;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
```

---

## 計算例（仕様書 §4.2 より）

### 並び替え前

| スポット | 開始時刻 | 所要時間 |
|---|---|---|
| 神社 | 12:00 | 60分（1時間） |
| 市場 | 13:00 | 180分（3時間） |

### 「神社」と「市場」の順序を入れ替え

| 並び替え後 | 開始時刻 | 所要時間 |
|---|---|---|
| 市場 | 12:00 | 180分（先頭なのでそのまま） |
| 神社 | 15:00 | 60分（12:00 + 180分） |

---

## 発火タイミング

| イベント | 処理 |
|---|---|
| スポット追加 | フォーム送信後、spots 配列を更新してから `recalcTimes` を呼ぶ |
| スポット削除 | 対象を除いた配列を作成してから `recalcTimes` を呼ぶ |
| D&D 並び替え | ドロップ確定後、新しい順序の配列で `recalcTimes` を呼ぶ |

---

## 呼び出しパターン（コンポーネント側）

```typescript
// スポット追加
const handleAddSpot = (newSpot: Spot) => {
  const updated = recalcTimes([...spots, newSpot]);
  setSpots(updated);
};

// スポット削除
const handleDeleteSpot = (id: number) => {
  const updated = recalcTimes(spots.filter(s => s.id !== id));
  setSpots(updated);
};

// D&D 並び替え
const handleDrop = (newOrder: Spot[]) => {
  const updated = recalcTimes(newOrder);
  setSpots(updated);
};
```

---

## 注意事項

- 日付をまたぐ計算（例: 23:30 + 60分 → 00:30）は `% 24` で処理するが、
  UI 上は日付をまたいだ時刻として表示する（翌日扱いはしない）
- 先頭スポットの `startTime` はユーザーが入力した値を維持する
  （`recalcTimes` は index 0 を変更しない）
