import Layout from '../components/Layout'
import Section from '../components/Section'
import { resourcesData } from '../data/resources'

export default function Contests() {
  return (
    <Layout title="Programming Contests">
      <Section title="Contest Platforms" resources={resourcesData.contests} />
    </Layout>
  )
}