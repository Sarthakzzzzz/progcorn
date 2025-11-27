import Layout from '../components/Layout'
import Section from '../components/Section'
import { resourcesData } from '../data/resources'

export default function Tools() {
  return (
    <Layout title="Development Tools">
      <Section title="Essential Tools" resources={resourcesData.tools} />
    </Layout>
  )
}