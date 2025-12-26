import React from 'react';
import {
    Send, Reply, Forward, Mail, Search, Sparkles, Calendar,
    UserPlus, Moon, Sun, Bell, Download, Clock, Minimize2,
    Briefcase, Paperclip, Plus, Star, ChevronRight, BarChart3
} from 'lucide-react';
import { SuggestedChip } from './types';

interface ActionChipsProps {
    chips: SuggestedChip[];
    onChipClick: (chip: SuggestedChip) => void;
    isDark?: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    'edit': <Mail size={12} />,
    'search': <Search size={12} />,
    'mail': <Mail size={12} />,
    'sparkles': <Sparkles size={12} />,
    'reply': <Reply size={12} />,
    'forward': <Forward size={12} />,
    'calendar': <Calendar size={12} />,
    'user-plus': <UserPlus size={12} />,
    'minimize': <Minimize2 size={12} />,
    'briefcase': <Briefcase size={12} />,
    'clock': <Clock size={12} />,
    'paperclip': <Paperclip size={12} />,
    'plus': <Plus size={12} />,
    'star': <Star size={12} />,
    'moon': <Moon size={12} />,
    'sun': <Sun size={12} />,
    'bell': <Bell size={12} />,
    'download': <Download size={12} />,
    'chart': <BarChart3 size={12} />,
};

const ActionChips: React.FC<ActionChipsProps> = ({ chips, onChipClick, isDark = false }) => {
    return (
        <div className="flex flex-wrap gap-2 py-2">
            {chips.map((chip) => (
                <button
                    key={chip.id}
                    onClick={() => onChipClick(chip)}
                    className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
            transition-all duration-200 hover:scale-105 active:scale-95
            ${isDark
                            ? 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }
          `}
                >
                    {chip.icon && ICON_MAP[chip.icon]}
                    <span>{chip.label}</span>
                    <ChevronRight size={10} className="opacity-50" />
                </button>
            ))}
        </div>
    );
};

export default ActionChips;
