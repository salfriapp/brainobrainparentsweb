const statusStyles = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
  signed: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-amber-100 text-amber-700',
  overdue: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  partial: 'bg-orange-100 text-orange-700',
}

export default function Badge({ status, label }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${style}`}>
      {label || status}
    </span>
  )
}
