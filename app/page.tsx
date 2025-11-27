"use client"
import Section from '../components/Section'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
        <p className="text-sm text-slate-600">Curated programming resources by topic.</p>
      </header>

      <Section title="Trending" endpoint="/resources?sort=popular" />
      <Section title="Newest" endpoint="/resources?sort=newest" />
      <Section title="Competitive Programming" endpoint="/search?tag=dsa" />
      <Section title="Web Development" endpoint="/search?tag=web" />
      <Section title="Backend" endpoint="/search?tag=backend" />
      <Section title="System Design" endpoint="/search?tag=system-design" />
    </div>
  )
}
