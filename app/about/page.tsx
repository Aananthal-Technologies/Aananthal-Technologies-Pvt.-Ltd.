import Link from 'next/link'

export default function About() {
  return (
    <div>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About Us</Link> | <Link href="/contact">Contact</Link>
      </nav>
      <h1>About Us</h1>
      <p>Aananthal Technologies - Leading technology solutions provider</p>
    </div>
  )
}
