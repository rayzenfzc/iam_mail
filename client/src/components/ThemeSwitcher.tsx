import React, { useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useFeatureFlags, useSuperhumanTheme, useUIV2 } from '../hooks/useFeatureFlags';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

/**
 * Theme Switcher Component
 * Allows users to toggle between:
 * - Default theme (light/dark)
 * - Superhuman theme (high contrast)
 */
export function ThemeSwitcher() {
    const { flags, setFlag } = useFeatureFlags();
    const isSuperhumanTheme = useSuperhumanTheme();
    // Guard: Only allow if uiV2 is enabled
    const isV2 = useUIV2();

    // Apply theme to document
    useEffect(() => {
        // SECURITY GUARD: If uiV2 is false, FORCE default theme
        // This prevents Superhuman mode from leaking if flag is disabled
        if (isSuperhumanTheme && isV2) {
            document.documentElement.setAttribute('data-theme', 'superhuman');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [isSuperhumanTheme, isV2]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    {isSuperhumanTheme ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Monitor className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => setFlag('superhumanTheme', false)}
                    className={!isSuperhumanTheme ? 'bg-accent' : ''}
                >
                    <Monitor className="mr-2 h-4 w-4" />
                    Default
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setFlag('superhumanTheme', true)}
                    className={isSuperhumanTheme ? 'bg-accent' : ''}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    Superhuman
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Feature Flag Toggle Component
 * For development/testing - shows all available feature flags
 */
export function FeatureFlagPanel() {
    const { flags, setFlag, enableAll, disableAll } = useFeatureFlags();

    return (
        <div className="p-4 bg-surface border border-default rounded-lg space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">Feature Flags</h3>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={disableAll}>
                        Disable All
                    </Button>
                    <Button size="sm" variant="default" onClick={enableAll}>
                        Enable All
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                {Object.entries(flags).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-secondary capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setFlag(key as any, e.target.checked)}
                            className="h-4 w-4 rounded border-default"
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
