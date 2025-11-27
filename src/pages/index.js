import Layout from '../components/Layout'
import Section from '../components/Section'
import { resourcesData } from '../data/resources'

export default function Home() {
  return (
    <Layout title="Programming Resources Hub">
      <div className="text-center mb-12">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover curated programming resources, tools, and learning platforms 
          to accelerate your development journey.
        </p>
      </div>
      
      <Section title="Featured Learning Platforms" resources={resourcesData.learning.slice(0, 3)} />
      <Section title="Essential Tools" resources={resourcesData.tools.slice(0, 3)} />
      <Section title="Popular Contests" resources={resourcesData.contests.slice(0, 3)} />
    </Layout>
  )
}