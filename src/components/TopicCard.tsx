// src/components/TopicCard.tsx
import React from 'react';
import {
  Flame,
  SplitSquareVertical,
  Heart,
  Users,
  Music,
  Beer,
  Search,
  HeartHandshake,
  Globe,
  Scale,
  AlertCircle
} from 'lucide-react';

const iconMap = {
  Flame,
  SplitSquare: SplitSquareVertical,
  Heart,
  Users,
  Music,
  Beer,
  Search,
  HeartHandshake,
  Globe,
  Scale,
  AlertCircle
};

interface TopicCardProps {
  topicId: string;
  displayName: string;  // nome del topic localizzato
  color: string;
  icon: string;
  points: number;
  onClick: () => void;
}

export default function TopicCard({
  topicId,
  displayName,
  color,
  icon,
  points,
  onClick
}: TopicCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || AlertCircle;

  return (
    <button
      onClick={onClick}
      className={`${color} relative p-8 rounded-2xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl w-full max-w-sm mx-auto animate-fadeIn overflow-hidden`}
    >
      {/* Icona grande sfumata */}
      <Icon
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
}
