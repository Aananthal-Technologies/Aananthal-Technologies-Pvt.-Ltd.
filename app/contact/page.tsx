import Link from 'next/link'

export default function Contact() {
  return (
    <div>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About Us</Link> | <Link href="/contact">Contact</Link>
      </nav>
      <h1>Contact Us</h1>
      <p>Get in touch with Aananthal Technologies</p>
    </div>
  )
}
