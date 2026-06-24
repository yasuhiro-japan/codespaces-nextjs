export const site = {
  name: 'たびしおり',
  badge: '✈️ たびしおり',
  tagline: '旅の日程を、みんなで共有しよう。',
  description: 'スポット・費用・時間をまとめて管理して、URLひとつで仲間と共有できる旅行プランアプリ。',
  metaDescription: 'みんなの旅のしおりを、リンクで共有。日程・スポット・費用をまとめて管理できる旅行プランアプリ',
  homeTitle: 'たびしおり — みんなの旅のしおりを、リンクで共有。',
  titleSeparator: ' — ',
} as const;

export function formatPageTitle(pageTitle?: string): string {
  if (!pageTitle) return site.name;
  return `${pageTitle}${site.titleSeparator}${site.name}`;
}
