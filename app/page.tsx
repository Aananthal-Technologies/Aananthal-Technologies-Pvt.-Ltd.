import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <h2 className="navbar-brand">Aananthal Technologies</h2>
          <div className="navbar-links">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </nav>
      
      <main className="container">
        <section className="hero">
          <h1>Welcome to Aananthal Technologies</h1>
          <p>Leading Technology Solutions Provider</p>
        </section>
        
        <section className="features">
          <div className="feature-card">
            <h3>Innovation</h3>
            <p>Cutting-edge technology solutions for modern businesses</p>
          </div>
          <div className="feature-card">
            <h3>Excellence</h3>
            <p>Delivering quality services with industry expertise</p>
          </div>
          <div className="feature-card">
            <h3>Support</h3>
            <p>24/7 dedicated support for all your needs</p>
          </div>
        </section>
      </main>
    </div>
  )
}
