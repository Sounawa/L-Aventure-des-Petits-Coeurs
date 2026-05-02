'use client';

export default function Footer() {
  return (
    <footer className="text-center py-6 px-4 text-xs text-muted-foreground border-t border-border/50 bg-gradient-to-b from-background to-muted/30">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪞</span>
          <span className="font-semibold text-foreground/70">L&apos;Alchimie du Miroir</span>
        </div>
        <p>L&apos;Aventure des Petits Cœurs ✨</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          Inspiré des enseignements de Al-Ghazālī, Ibn al-Qayyim et Ibn &apos;Arabī
        </p>
        <p className="text-[10px] text-muted-foreground/40">
          Version enfants — Pour les cœurs de 6 à 12 ans 🌟
        </p>
      </div>
    </footer>
  );
}
