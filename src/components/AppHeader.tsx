interface AppHeaderProps {
  onToggleSearch: () => void;
  onOpenAdd: () => void;
  onLocateMe: () => void;
  isLocating?: boolean;
}

export function AppHeader({ onToggleSearch, onOpenAdd, onLocateMe, isLocating }: AppHeaderProps) {
  return (
    <header className="absolute top-0 left-0 w-full h-[60px] z-[1000] flex items-center justify-between px-4 pointer-events-none"
      style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
      <div className="pointer-events-auto bg-background/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        <h1 className="font-extrabold text-lg text-foreground">🔍 خدمات بشتيل</h1>
      </div>
      <div className="pointer-events-auto flex gap-2">
        <button
          onClick={onLocateMe}
          disabled={isLocating}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm text-foreground shadow-lg active:scale-95 transition-transform border border-border disabled:opacity-50"
          title="موقعي"
        >
          {isLocating ? (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <i className="fa-solid fa-location-crosshairs" />
          )}
        </button>
        <button
          onClick={onToggleSearch}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-magnifying-glass" /> بحث
        </button>
        <button
          onClick={onOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-success text-foreground font-bold text-sm shadow-lg active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-plus" /> إضافة
        </button>
      </div>
    </header>
  );
}
