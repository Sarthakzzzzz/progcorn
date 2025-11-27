type Props = { params: { category: string } }
export default function CategoryPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Category: {params.category}</h1>
      <p className="text-sm text-gray-500">Resources in this category will be listed.</p>
    </div>
  )}
