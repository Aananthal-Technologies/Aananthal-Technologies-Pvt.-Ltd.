import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About Us</Link> | <Link href="/contact">Contact</Link>
      </nav>
      <h1>Welcome to Aananthal Technologies</h1>
    </div>
  )
}
