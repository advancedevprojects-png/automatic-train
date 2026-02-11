import { SizeLimit } from '@/types';
import { cn } from '@/utils/cn';

interface SizeFilterProps {
  currentLimit: SizeLimit;
  onChange: (limit: SizeLimit) => void;
}

export function SizeFilter({ currentLimit, onChange }: SizeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Max Size:</span>
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => onChange(3)}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-all',
            currentLimit === 3
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          3 MB
        </button>
        <button
          onClick={() => onChange(5)}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-all',
            currentLimit === 5
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          5 MB
        </button>
      </div>
    </div>
  );
}
