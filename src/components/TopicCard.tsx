import React from 'react';
import { Topic } from '../types';
import { Flame, SplitSquareVertical as SplitSquare, Heart, Users, Music } from 'lucide-react';

const iconMap = {
  Flame,
  SplitSquare,
  Heart,
  Users,
  Music
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
      className={`${topic.color} p-8 rounded-2xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl w-full max-w-sm mx-auto animate-fadeIn`}
    >
      <Icon size={32} className="text-white mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">{topic.name}</h3>
      <p className="text-white/80">
        {topic.cards.filter(card => !card.used).length} cards remaining
      </p>
    </button>
  );
}