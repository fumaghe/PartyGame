// src/components/TopicCard.tsx
import React from 'react';
import * as Icons from 'lucide-react';

interface TopicCardProps {
  topicId: string;
  displayName: string; // Nome del topic localizzato
  color: string;
  icon: string; // Nome dell'icona da lucide-react
  points: number;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topicId,
  displayName,
  color,
  icon,
  points,
  onClick,
}) => {
  // Mappa il nome dell'icona a un componente di lucide-react
  const IconComponent = (Icons as any)[icon] || Icons.AlertCircle;

  return (
    <button
      onClick={onClick}
      className={`${color} relative p-8 rounded-2xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl w-full max-w-sm mx-auto overflow-hidden`}
    >
      {/* Icona grande sfumata */}
      <IconComponent
        size={128}
        className="text-white opacity-20 absolute inset-0 m-auto"
        style={{ maxWidth: '80%', maxHeight: '80%' }}
      />

      {/* Nome del topic + punteggio */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h3 className="text-3xl font-bold text-white text-center px-4">
          {displayName}
        </h3>
        <span className="text-white text-lg mt-2">
          {points} {points === 1 ? 'punto' : 'punti'}
        </span>
      </div>
    </button>
  );
};

export default TopicCard;
