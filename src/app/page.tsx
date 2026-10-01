export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>products-api</h1>
      <p>
        Try <a href="/api/products">/api/products</a> (run <code>POST /api/products/sync</code> first).
      </p>
    </main>
  );
}
