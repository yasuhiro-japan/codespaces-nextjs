# データモデル

型定義の実装は `src/types/trip.ts` に配置する。

---

## TypeScript 型定義

```typescript
export interface Cost {
  label: string;   // 費用の項目名（例: 入場料）
  amount: string;  // 金額（数値文字列、円単位）
}

export interface Spot {
  id: number;
  name: string;          // スポット名（必須）
  startTime: string;     // 開始時刻 "HH:MM"。先頭スポットのみ直接保持
  duration: number;      // 所要時間（分）: 30|60|90|120|150|180|240|300
  category: SpotCategory;
  note: string;          // メモ（任意、空文字可）
  url: string;           // 参考URL（任意、空文字可）
  costs: Cost[];         // 費用項目（最大3件）
}

export type SpotCategory = '観光' | 'グルメ' | '散策' | '体験' | '宿泊';

export interface Day {
  date: string;    // "YYYY-MM-DD"
  spots: Spot[];   // 順序あり配列
}

export interface Trip {
  id: number;
  title: string;
  destination: string;
  startDate: string;   // "YYYY-MM-DD"
  endDate: string;     // "YYYY-MM-DD"
  cover: string;       // 絵文字（例: "✈️"）
  days: Day[];         // startDate〜endDate の日数分を自動生成
}
```

---

## 制約

| 制約 | 詳細 |
|---|---|
| `costs` の最大件数 | 1スポットにつき **最大3件**。3件に達したら UI の「+ 追加」ボタンを非表示 |
| `amount` の値 | 数値のみ許容。未入力・非数値の場合は合計費用を「—」表示 |
| `duration` の選択肢 | 30 / 60 / 90 / 120 / 150 / 180 / 240 / 300（分）の固定セット |
| `url` の省略 | 空文字可。未入力でも他項目の登録に影響しない |

---

## `days` 自動生成ルール

旅行作成時に `startDate` と `endDate` から `days` 配列を生成する:

```typescript
function generateDays(startDate: string, endDate: string): Day[] {
  const days: Day[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    days.push({ date: current.toISOString().slice(0, 10), spots: [] });
    current.setDate(current.getDate() + 1);
  }
  return days;
}
```

---

## `startTime` の持ち方

- **先頭スポット（index 0）**: `startTime` フィールドに直接保持する（ユーザーが入力）
- **2番目以降のスポット**: `recalcTimes` が算出した値を `startTime` に上書きする
- 並び替え・追加・削除のたびに `recalcTimes` を呼び出して全スポットの `startTime` を更新する

詳細は [time-recalc.md](./time-recalc.md) を参照。

---

## 合計費用の算出

スポットの合計費用は `costs` 配列の `amount` を数値に変換して合算する:

```typescript
function calcTotalCost(costs: Cost[]): number | null {
  if (costs.length === 0) return null;
  const total = costs.reduce((sum, c) => {
    const n = parseFloat(c.amount);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
  return total;
}
```

`null` を返した場合（費用未設定）は UI 上で「—」と表示する。
