import { CATEGORIES, type Category } from '@/lib/constants';

interface CategoryGridProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryGrid({ selected, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 max-[380px]:grid-cols-3 gap-2.5 pb-2.5 max-h-[250px] overflow-y-auto">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center justify-center gap-2 p-2.5 rounded-xl border text-sm min-h-[80px] transition-all ${
            selected === cat.id
              ? 'bg-primary text-primary-foreground border-primary shadow-lg -translate-y-0.5'
              : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
          }`}
        >
          <span className="text-3xl">{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
