export default function ResourceCard({ title, description, url, category }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {category}
        </span>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </a>
  )
}