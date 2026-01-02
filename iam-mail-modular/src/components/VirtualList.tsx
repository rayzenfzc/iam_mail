import React, { useLayoutEffect, useRef, useState, forwardRef, useMemo } from 'react';
import * as ReactWindow from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { GlassModule } from './Glass';
import { SystemItem } from '../types';

// Robust import strategy for react-window from ESM CDN
const FixedSizeList = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList || ReactWindow.default;

interface VirtualListProps {
    items: SystemItem[];
    selectedItemId: string | number | null;
    onSelect: (id: string | number) => void;
    itemSize: number;
    paddingBottom?: number;
}

const Row = ({ index, style, data }: ListChildComponentProps) => {
    const { items, selectedItemId, onSelect } = data;
    const item = items[index];

    return (
        <div style={{ ...style, paddingBottom: 8, paddingRight: 4, paddingLeft: 4 }}>
            <GlassModule 
                isActive={selectedItemId === item.id} 
                onClick={() => onSelect(item.id)}
                className="h-full"
            >
                {item.type === 'mail' && (
                    <div className="p-5 flex flex-col gap-3 h-full justify-between">
                        <div className="flex justify-between items-start">
                            <span className={`text-[0.7rem] font-bold uppercase tracking-wider ${selectedItemId === item.id ? 'text-slate-900' : 'text-slate-600'}`}>{item.sender}</span>
                            <span className="text-[0.55rem] font-mono text-slate-400">{item.time}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-800 leading-tight tracking-tight truncate">{item.subject}</div>
                        <div className="flex justify-between items-center">
                            {item.status && <span className={`text-[0.5rem] font-bold uppercase tracking-widest px-2 py-1 rounded border ${item.status === 'URGENT' ? 'bg-slate-800 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{item.status}</span>}
                        </div>
                    </div>
                )}
                {item.type === 'contact' && (
                    <div className="p-4 flex items-center gap-4 h-full">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">{item.name?.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">{item.name}</div>
                            <div className="text-[0.6rem] uppercase tracking-wide text-slate-500 mt-0.5 truncate">{item.role}</div>
                        </div>
                        {item.status === 'ONLINE' && <div className="w-2 h-2 rounded-full bg-slate-700"></div>}
                    </div>
                )}
                {item.type === 'event' && (
                    <div className="p-4 flex items-center gap-5 h-full">
                        <div className="flex flex-col items-center justify-center w-12 border-r border-slate-200/50 pr-4 shrink-0">
                            <span className="text-[0.6rem] font-bold text-slate-400">{item.date?.split(' ')[0]}</span>
                            <span className="text-sm font-black text-slate-900">{item.date?.split(' ')[1]}</span>
                        </div>
                        <div className="min-w-0">
                            <div className="text-[0.6rem] font-mono text-slate-600 mb-1">{item.time}</div>
                            <div className="text-sm font-bold text-slate-900 uppercase tracking-wide truncate">{item.title}</div>
                        </div>
                    </div>
                )}
            </GlassModule>
        </div>
    );
};

export const VirtualList: React.FC<VirtualListProps> = ({ items, selectedItemId, onSelect, itemSize, paddingBottom = 0 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const updateHeight = () => {
                setHeight(containerRef.current?.offsetHeight || 0);
            };
            updateHeight();
            const observer = new ResizeObserver(updateHeight);
            observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, []);

    const InnerList = useMemo(() => forwardRef<HTMLDivElement, any>(({ style, ...rest }, ref) => (
        <div
            ref={ref}
            style={{
                ...style,
                height: `${parseFloat(style.height) + paddingBottom}px`
            }}
            {...rest}
        />
    )), [paddingBottom]);

    if (!FixedSizeList) {
        return <div className="p-4 text-xs text-red-500">Error loading list component.</div>;
    }

    return (
        <div ref={containerRef} className="flex-1 w-full h-full">
            {height > 0 && (
                <FixedSizeList
                    height={height}
                    itemCount={items.length}
                    itemSize={itemSize}
                    width="100%"
                    itemData={{ items, selectedItemId, onSelect }}
                    className="custom-scrollbar"
                    innerElementType={InnerList}
                >
                    {Row}
                </FixedSizeList>
            )}
        </div>
    );
};