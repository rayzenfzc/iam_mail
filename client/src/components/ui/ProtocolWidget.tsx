
import React from 'react';
import { ThemeMode } from '../../types';

interface ProtocolWidgetProps {
    theme?: ThemeMode;
}

const ProtocolWidget: React.FC<ProtocolWidgetProps> = ({ theme = 'dark' }) => {
    const isDark = theme === 'dark';

    return (
        <div className={`p-4 rounded-[8px] border transition-all ${isDark ? 'bg-white/5 border-white/12' : 'bg-white border-black/5 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#10b981] animate-pulse`} />
                <h4 className="text-[11px] font-bold font-sans uppercase opacity-80">Vitreous Protocol</h4>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-mono">
                    <span className="opacity-30">ENCRYPTION:</span>
                    <span className="opacity-60">AES-256-GCM</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                    <span className="opacity-30">SESSION ID:</span>
                    <span className="opacity-60">VX-990-2</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                    <span className="opacity-30">UPLINK:</span>
                    <span className="text-v-crimson opacity-80">STABLE</span>
                </div>
            </div>

            <div className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/5'} flex flex-col gap-1`}>
                <div className="h-1 w-full bg-current/5 rounded-full overflow-hidden">
                    <div className="h-full bg-v-crimson w-2/3" />
                </div>
                <span className="text-[8px] font-mono opacity-20 uppercase">Protocol Volatility Level // 0.2</span>
            </div>
        </div>
    );
};

export default ProtocolWidget;
