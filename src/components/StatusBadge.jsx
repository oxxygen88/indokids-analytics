import { getStatusColor } from '../utils/dataFormatter'

function StatusBadge({ value }) {
  if (!value) {
    return <span className="text-gray-400">-</span>
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(value)}`}
    >
      {value}
    </span>
  )
}

export default StatusBadge