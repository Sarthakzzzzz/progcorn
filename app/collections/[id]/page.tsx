type Props = { params: { id: string } }
export default function CollectionDetailPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Collection {params.id}</h1>
      <p className="text-sm text-gray-500">Collection items will be listed.</p>
    </div>
  )
}
