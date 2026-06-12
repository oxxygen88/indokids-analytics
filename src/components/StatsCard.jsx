function StatsCard({
  title,
  value,
  subtitle,
  tone = 'blue',
}) {
  const toneClass = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    gray: 'text-gray-700',
  }

  return (
    <div className="card">
      <div className="text-gray-500 text-sm mb-2">
        {title}
      </div>

      <div className={`text-3xl font-bold ${toneClass[tone] || toneClass.blue}`}>
        {value}
      </div>

      {subtitle && (
        <div className="text-xs text-gray-400 mt-2">
          {subtitle}
        </div>
      )}
    </div>
  )
}

export default StatsCard