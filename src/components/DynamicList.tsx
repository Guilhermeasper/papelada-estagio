import { Button } from './Button';

interface DynamicListProps {
  label: string;
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  minItems?: number;
  placeholder?: string;
  error?: string;
}

export function DynamicList({
  label,
  items,
  onAdd,
  onRemove,
  onChange,
  minItems = 1,
  placeholder = 'Digite aqui...',
  error,
}: DynamicListProps) {
  const canRemove = items.length > minItems;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
          {label}
          <span className="text-cin-red ml-0.5">*</span>
        </label>
        <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
          Mínimo: {minItems} item(s)
        </span>
      </div>

      <div className="flex flex-col gap-3 md:gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-start gap-1 md:gap-2">

            <div className="flex items-center justify-between md:hidden">
              <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
                {index + 1}.
              </span>
              {canRemove && (
                <Button
                  type="button"
                  onClick={() => onRemove(index)}
                  variant="ghost"
                  className="
                    p-1.5 h-auto
                    text-text-secondary dark:text-text-secondary-dark hover:text-cin-red
                    hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10
                  "
                  title="Remover item"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </Button>
              )}
            </div>
            

            <span className="hidden md:flex flex-shrink-0 w-6 h-10 items-center justify-center text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
              {index + 1}.
            </span>
            
            <textarea
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className={`
                w-full md:flex-1 min-w-0 px-3 md:px-4 py-2 md:py-2.5 
                text-sm md:text-base
                border border-border dark:border-border-dark rounded-md
                bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark
                placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark
                transition-colors duration-200
                hover:border-text-secondary dark:hover:border-text-secondary-dark
                focus:border-cin-red focus:ring-2 focus:ring-cin-red/20
                resize-y min-h-[50px] md:min-h-[60px]
              `}
            />
            

            {canRemove && (
              <Button
                type="button"
                onClick={() => onRemove(index)}
                variant="ghost"
                className="
                  hidden md:flex
                  flex-shrink-0 w-10 h-10 p-0
                  items-center justify-center
                  text-text-secondary dark:text-text-secondary-dark hover:text-cin-red
                  hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10
                "
                title="Remover item"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="self-start"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
            clipRule="evenodd" 
          />
        </svg>
        Adicionar item
      </Button>

      {error && (
        <p className="text-xs text-cin-red font-medium">{error}</p>
      )}
    </div>
  );
}
