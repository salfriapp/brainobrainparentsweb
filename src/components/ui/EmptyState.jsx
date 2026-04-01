import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-12 h-12 text-gray-300 mb-3" />
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  )
}
