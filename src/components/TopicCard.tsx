import React from 'react';
import { Topic } from '../types';
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
  topic: Topic;
  onClick: () => void;
}

export default function TopicCard({ topic, onClick }: TopicCardProps) {
  const Icon = iconMap[topic.icon as keyof typeof iconMap];

  return (
    <button
      onClick={onClick}
      className={`${topic.color} relative p-8 rounded-2xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl w-full max-w-sm mx-auto animate-fadeIn overflow-hidden`}
    >
      {/* Icona di sfondo trasparente */}
      <Icon
        size={128} // Dimensione aumentata
        className="text-white opacity-20 absolute inset-0 m-auto"
        style={{ maxWidth: '80%', maxHeight: '80%' }}
      />
      
      {/* Testo del topic centrato */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h3 className="text-3xl font-bold text-white text-center px-4">
          {topic.name}
        </h3>
      </div>
    </button>
  );
}
