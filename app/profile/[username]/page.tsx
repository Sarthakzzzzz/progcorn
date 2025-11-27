type Props = { params: { username: string } }
export default function ProfilePage({ params }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">@{params.username}</h1>
      <p className="text-sm text-gray-500">User profile page.</p>
    </div>
  )
}
