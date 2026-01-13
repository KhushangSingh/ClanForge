import { Code, Dumbbell, Gamepad2, Layers, Music, Briefcase, PenTool, GraduationCap, Trophy } from 'lucide-react';

export const API_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';

export const CATEGORIES = [
  { id: 'hackathon', label: 'Hackathon', icon: Code, color: 'text-violet-600 ring-violet-100', badge: 'bg-violet-50 text-violet-700 border-violet-100' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'text-emerald-600 ring-emerald-100', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: 'sports', label: 'Sports', icon: Trophy, color: 'text-orange-600 ring-orange-100', badge: 'bg-orange-50 text-orange-700 border-orange-100' },
  { id: 'jamming', label: 'Jamming', icon: Music, color: 'text-rose-600 ring-rose-100', badge: 'bg-rose-50 text-rose-700 border-rose-100' },
  { id: 'project', label: 'Project', icon: Briefcase, color: 'text-blue-600 ring-blue-100', badge: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 'study', label: 'Study', icon: GraduationCap, color: 'text-amber-600 ring-amber-100', badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  { id: 'creative', label: 'Creative', icon: PenTool, color: 'text-fuchsia-600 ring-fuchsia-100', badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100' },
];

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];

export const AVATARS = [
  "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=ffedd5",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Ginger&backgroundColor=fed7aa",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Creator&backgroundColor=fff3e0",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Milo&backgroundColor=fdba74",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Avery&backgroundColor=f97316",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Oliver&backgroundColor=fcd34d",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Zoey&backgroundColor=fff7ed",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Daisy&backgroundColor=ea580c",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas&backgroundColor=ffcc80",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Leo&backgroundColor=fcd34d",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Sunny&backgroundColor=ffcc80",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Ruby&backgroundColor=fb8c00"
];

export const getCategoryStyle = (catId) => {
  const cat = CATEGORIES.find(c => c.id === catId);
  return cat ? cat : { icon: Layers, label: 'General', color: 'text-stone-600', badge: 'bg-stone-100 text-stone-600' };
};