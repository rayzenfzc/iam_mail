import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Feature flags for gradual UI v2 rollout
 * Stored in localStorage for per-user control
 */
interface FeatureFlags {
    uiV2: boolean;
    commandPalette: boolean;
    newCalendar: boolean;
    superhumanTheme: boolean;
}

interface FeatureFlagStore {
    flags: FeatureFlags;
    setFlag: (flag: keyof FeatureFlags, value: boolean) => void;
    isEnabled: (flag: keyof FeatureFlags) => boolean;
    enableAll: () => void;
    disableAll: () => void;
}

export const useFeatureFlags = create<FeatureFlagStore>()(
    persist(
        (set, get) => ({
            flags: {
                uiV2: false,
                commandPalette: false,
                newCalendar: false,
                superhumanTheme: false,
            },
            setFlag: (flag, value) =>
                set((state) => ({
                    flags: { ...state.flags, [flag]: value },
                })),
            isEnabled: (flag) => get().flags[flag],
            enableAll: () =>
                set({
                    flags: {
                        uiV2: true,
                        commandPalette: true,
                        newCalendar: true,
                        superhumanTheme: true,
                    },
                }),
            disableAll: () =>
                set({
                    flags: {
                        uiV2: false,
                        commandPalette: false,
                        newCalendar: false,
                        superhumanTheme: false,
                    },
                }),
        }),
        {
            name: 'iam-feature-flags',
        }
    )
);

/**
 * Hook to check if UI v2 is enabled
 * Usage: const isV2 = useUIV2();
 */
export const useUIV2 = () => useFeatureFlags((s) => s.isEnabled('uiV2'));

/**
 * Hook to check if Superhuman theme is enabled
 * Usage: const isSuperhuman = useSuperhumanTheme();
 */
export const useSuperhumanTheme = () => useFeatureFlags((s) => s.isEnabled('superhumanTheme'));
