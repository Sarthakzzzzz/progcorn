import Layout from '../components/Layout'
import Section from '../components/Section'
import { resourcesData } from '../data/resources'

export default function Resources() {
  return (
    <Layout title="Learning Resources">
      <Section title="Learning Platforms" resources={resourcesData.learning} />
      <Section title="Documentation" resources={resourcesData.documentation} />
    </Layout>
  )
}