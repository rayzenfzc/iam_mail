import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';

// ============================================
// TYPES
// ============================================

export type ActiveView = 'inbox' | 'compose' | 'settings' | 'homeHub' | 'calendar' | 'contacts' | 'tasks' | 'files';
export type DockMode = 'list_view' | 'thread_view' | 'compose_view' | 'picker_view' | 'settings_view' | 'home_view' | 'calendar_view' | 'contacts_view';
export type InboxFilter = 'all' | 'unread' | 'urgent';
export type PickerType = 'contacts' | 'attachments' | 'date' | null;
export type SendStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'queued_offline';

export interface ReturnTo {
    origin: 'homeHub' | 'inbox' | 'thread' | 'calendar' | 'contacts';
    activeView: ActiveView;
    selectedItemId: string | number | null;
    searchQuery: string;
    inboxFilter: InboxFilter;
    scrollPosition: number;
    dockMode: DockMode;
}

export interface ComposeDraft {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    body: string;
    attachments: File[];
    dirty: boolean;
    accountId: string;
}

export interface Account {
    id: string;
    email: string;
    provider: string;
    aiAllowed: boolean;
    isActive: boolean;
}

export interface AppState {
    // Navigation
    activeView: ActiveView;
    selectedItemId: string | number | null;

    // Search & Filter
    searchQuery: string;
    inboxFilter: InboxFilter;

    // Compose
    composeDraft: ComposeDraft;
    returnTo: ReturnTo | null;

    // Pickers
    pickerOpen: PickerType;

    // AI
    aiEnabled: boolean;

    // Accounts
    accounts: Account[];
    currentAccountId: string | null;

    // Thread navigation
    threadIndex: number;
    threadTotal: number;

    // UI State
    isSidebarOpen: boolean;
    scrollPosition: number;
}

// ============================================
// INITIAL STATE
// ============================================

const initialDraft: ComposeDraft = {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: [],
    dirty: false,
    accountId: ''
};

const initialState: AppState = {
    activeView: 'inbox',
    selectedItemId: null,
    searchQuery: '',
    inboxFilter: 'all',
    composeDraft: initialDraft,
    returnTo: null,
    pickerOpen: null,
    aiEnabled: true,
    accounts: [],
    currentAccountId: null,
    threadIndex: 0,
    threadTotal: 0,
    isSidebarOpen: false,
    scrollPosition: 0
};

// ============================================
// DOCK MODE RESOLVER (Core Logic)
// ============================================

export function deriveDockMode(state: AppState): DockMode {
    // 1) Picker overrides everything (modal)
    if (state.pickerOpen) return 'picker_view';

    // 2) Settings BEFORE selectedItemId
    if (state.activeView === 'settings') return 'settings_view';

    // 3) Home Hub
    if (state.activeView === 'homeHub') return 'home_view';

    // 4) Calendar view
    if (state.activeView === 'calendar') return 'calendar_view';

    // 5) Contacts view
    if (state.activeView === 'contacts') return 'contacts_view';

    // 6) Compose (primary action screen)
    if (state.activeView === 'compose') return 'compose_view';

    // 7) Thread ONLY when inbox + item selected
    if (state.activeView === 'inbox' && state.selectedItemId != null) return 'thread_view';

    // 8) Default list view
    return 'list_view';
}

// ============================================
// ORIGIN RESOLVER
// ============================================

export function deriveOrigin(state: AppState): ReturnTo['origin'] {
    if (state.activeView === 'homeHub') return 'homeHub';
    if (state.activeView === 'inbox' && state.selectedItemId) return 'thread';
    if (state.activeView === 'inbox') return 'inbox';
    if (state.activeView === 'calendar') return 'calendar';
    if (state.activeView === 'contacts') return 'contacts';
    return 'inbox'; // fallback
}

// ============================================
// ACTIONS
// ============================================

type AppAction =
    | { type: 'SET_ACTIVE_VIEW'; payload: ActiveView }
    | { type: 'SELECT_ITEM'; payload: string | number | null }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_INBOX_FILTER'; payload: InboxFilter }
    | { type: 'OPEN_COMPOSE'; payload?: { mode: 'new' | 'reply' | 'forward'; data?: Partial<ComposeDraft> } }
    | { type: 'CLOSE_COMPOSE' }
    | { type: 'UPDATE_DRAFT'; payload: Partial<ComposeDraft> }
    | { type: 'CLEAR_DRAFT' }
    | { type: 'OPEN_PICKER'; payload: PickerType }
    | { type: 'CLOSE_PICKER' }
    | { type: 'SET_AI_ENABLED'; payload: boolean }
    | { type: 'SET_CURRENT_ACCOUNT'; payload: string }
    | { type: 'SET_ACCOUNTS'; payload: Account[] }
    | { type: 'SET_THREAD_INDEX'; payload: { index: number; total: number } }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'SET_SCROLL_POSITION'; payload: number }
    | { type: 'GO_BACK' };

// ============================================
// REDUCER
// ============================================

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_ACTIVE_VIEW':
            return { ...state, activeView: action.payload };

        case 'SELECT_ITEM':
            return { ...state, selectedItemId: action.payload };

        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };

        case 'SET_INBOX_FILTER':
            return { ...state, inboxFilter: action.payload };

        case 'OPEN_COMPOSE': {
            // Snapshot current context before opening compose
            const returnTo: ReturnTo = {
                origin: deriveOrigin(state),
                activeView: state.activeView,
                selectedItemId: state.selectedItemId,
                searchQuery: state.searchQuery,
                inboxFilter: state.inboxFilter,
                scrollPosition: state.scrollPosition,
                dockMode: deriveDockMode(state)
            };

            const newDraft = action.payload?.data
                ? { ...initialDraft, ...action.payload.data, dirty: false, accountId: state.currentAccountId || '' }
                : { ...initialDraft, accountId: state.currentAccountId || '' };

            return {
                ...state,
                activeView: 'compose',
                returnTo,
                composeDraft: newDraft
            };
        }

        case 'CLOSE_COMPOSE': {
            if (!state.returnTo) {
                return { ...state, activeView: 'inbox', composeDraft: initialDraft };
            }

            return {
                ...state,
                activeView: state.returnTo.activeView,
                selectedItemId: state.returnTo.selectedItemId,
                searchQuery: state.returnTo.searchQuery,
                inboxFilter: state.returnTo.inboxFilter,
                scrollPosition: state.returnTo.scrollPosition,
                returnTo: null,
                composeDraft: initialDraft
            };
        }

        case 'UPDATE_DRAFT':
            return {
                ...state,
                composeDraft: { ...state.composeDraft, ...action.payload, dirty: true }
            };

        case 'CLEAR_DRAFT':
            return { ...state, composeDraft: initialDraft };

        case 'OPEN_PICKER':
            return { ...state, pickerOpen: action.payload };

        case 'CLOSE_PICKER':
            return { ...state, pickerOpen: null };

        case 'SET_AI_ENABLED':
            return { ...state, aiEnabled: action.payload };

        case 'SET_CURRENT_ACCOUNT':
            return { ...state, currentAccountId: action.payload };

        case 'SET_ACCOUNTS':
            return { ...state, accounts: action.payload };

        case 'SET_THREAD_INDEX':
            return { ...state, threadIndex: action.payload.index, threadTotal: action.payload.total };

        case 'TOGGLE_SIDEBAR':
            return { ...state, isSidebarOpen: !state.isSidebarOpen };

        case 'SET_SCROLL_POSITION':
            return { ...state, scrollPosition: action.payload };

        case 'GO_BACK': {
            // Priority 1: Close picker
            if (state.pickerOpen) {
                return { ...state, pickerOpen: null };
            }

            // Priority 2: Clear search (in inbox)
            if (state.activeView === 'inbox' && state.searchQuery) {
                return { ...state, searchQuery: '' };
            }

            // Priority 3: Close compose (handled by CLOSE_COMPOSE with dirty check)
            if (state.activeView === 'compose') {
                // Note: Caller should check dirty state first and show confirm dialog
                return state;
            }

            // Priority 4: Close thread (go back to inbox list)
            if (state.activeView === 'inbox' && state.selectedItemId) {
                return { ...state, selectedItemId: null };
            }

            // Priority 5: From settings, return to previous
            if (state.activeView === 'settings' && state.returnTo) {
                return {
                    ...state,
                    activeView: state.returnTo.activeView,
                    selectedItemId: state.returnTo.selectedItemId,
                    returnTo: null
                };
            }

            // Priority 6: From any non-inbox view, go to inbox
            if (state.activeView !== 'inbox') {
                return { ...state, activeView: 'inbox', selectedItemId: null };
            }

            return state; // Already at inbox, do nothing (exit app behavior)
        }

        default:
            return state;
    }
}

// ============================================
// CONTEXT
// ============================================

interface AppContextValue {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    dockMode: DockMode;
    effectiveAiEnabled: boolean;
}

const AppStateContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const dockMode = useMemo(() => deriveDockMode(state), [state]);

    // AI is only enabled if global toggle is ON AND current account allows it
    const effectiveAiEnabled = useMemo(() => {
        if (!state.aiEnabled) return false;
        if (!state.currentAccountId) return state.aiEnabled;
        const account = state.accounts.find(a => a.id === state.currentAccountId);
        return account?.aiAllowed ?? state.aiEnabled;
    }, [state.aiEnabled, state.currentAccountId, state.accounts]);

    const value = useMemo(() => ({
        state,
        dispatch,
        dockMode,
        effectiveAiEnabled
    }), [state, dockMode, effectiveAiEnabled]);

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return context;
}

// ============================================
// ACTION HELPERS
// ============================================

export function useAppActions() {
    const { state, dispatch } = useAppState();

    return {
        // Navigation
        setActiveView: (view: ActiveView) => dispatch({ type: 'SET_ACTIVE_VIEW', payload: view }),
        selectItem: (id: string | number | null) => dispatch({ type: 'SELECT_ITEM', payload: id }),
        goBack: () => dispatch({ type: 'GO_BACK' }),
        toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),

        // Search & Filter
        setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
        setInboxFilter: (filter: InboxFilter) => dispatch({ type: 'SET_INBOX_FILTER', payload: filter }),
        clearSearch: () => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' }),

        // Compose
        openCompose: (mode: 'new' | 'reply' | 'forward' = 'new', data?: Partial<ComposeDraft>) =>
            dispatch({ type: 'OPEN_COMPOSE', payload: { mode, data } }),
        closeCompose: () => dispatch({ type: 'CLOSE_COMPOSE' }),
        updateDraft: (data: Partial<ComposeDraft>) => dispatch({ type: 'UPDATE_DRAFT', payload: data }),
        clearDraft: () => dispatch({ type: 'CLEAR_DRAFT' }),

        // Pickers
        openPicker: (picker: PickerType) => dispatch({ type: 'OPEN_PICKER', payload: picker }),
        closePicker: () => dispatch({ type: 'CLOSE_PICKER' }),

        // AI
        setAiEnabled: (enabled: boolean) => dispatch({ type: 'SET_AI_ENABLED', payload: enabled }),

        // Accounts
        setCurrentAccount: (accountId: string) => dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accountId }),
        setAccounts: (accounts: Account[]) => dispatch({ type: 'SET_ACCOUNTS', payload: accounts }),

        // Thread
        setThreadIndex: (index: number, total: number) =>
            dispatch({ type: 'SET_THREAD_INDEX', payload: { index, total } }),

        // Scroll
        setScrollPosition: (position: number) => dispatch({ type: 'SET_SCROLL_POSITION', payload: position }),

        // Check if draft is dirty (for confirm dialogs)
        isDraftDirty: () => state.composeDraft.dirty
    };
}
