// Developer note: When using external constituent/security-weight data,
// verify the provider's license terms and attribution requirements before
// ingesting, redistributing, or displaying that data in this service.
export default function Disclaimer() {
  return (
    <section
      aria-labelledby="disclaimer-heading"
      style={{
        backgroundColor: '#fff8e5',
        border: '1px solid #f4d06f',
        borderRadius: '12px',
        color: '#4d3b00',
        lineHeight: 1.7,
        marginTop: '3rem',
        padding: '1rem 1.25rem',
      }}
    >
      <h2
        id="disclaimer-heading"
        style={{
          fontSize: '1rem',
          margin: '0 0 0.5rem',
        }}
      >
        ご利用上の注意
      </h2>
      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
        <li>
          本サービスは情報提供を目的としており、特定商品の売買を推奨するものではありません。
        </li>
        <li>
          構成銘柄データには基準日があり、現在の実際の保有比率と異なる可能性があります。
        </li>
        <li>
          上位銘柄のみ対応する場合は、カバレッジ率や未カバー部分があることをご確認ください。
        </li>
      </ul>
    </section>
  )
}
