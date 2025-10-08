interface SimpleBarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  maxValue?: number;
}

export function SimpleBarChart({ data, title, maxValue }: SimpleBarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-2">
      {title && <h3 className="font-medium text-sm">{title}</h3>}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-xs text-gray-600 truncate">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  item.color || 'bg-blue-500'
                } transition-all duration-300`}
                style={{ width: `${max > 0 ? (item.value / max) * 100 : 0}%` }}
              />
            </div>
            <div className="w-8 text-xs text-gray-600 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

export function ProgressRing({ 
  percentage, 
  size = 60, 
  strokeWidth = 4, 
  color = '#3B82F6',
  children 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}