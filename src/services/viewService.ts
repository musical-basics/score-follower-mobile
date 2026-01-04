// View configuration service - LocalStorage based

export interface ViewConfig {
    id: string
    name: string
    mode: 'PLAYBACK' | 'RECORD'
    revealMode: 'OFF' | 'NOTE' | 'CURTAIN'
    darkMode: boolean
    isLocked: boolean
    highlightNote: boolean
    glowEffect: boolean
    popEffect: boolean
    jumpEffect: boolean
    cursorPosition: number
    curtainLookahead: number
    isBuiltIn?: boolean // True for default presets, prevents deletion
}

const STORAGE_KEY = 'scoreFollower_savedViews'

// Built-in presets
const DEFAULT_VIEWS: ViewConfig[] = [
    {
        id: 'work-mode',
        name: 'Work Mode',
        mode: 'RECORD',
        revealMode: 'OFF',
        darkMode: false,
        isLocked: false,
        highlightNote: true,
        glowEffect: false,
        popEffect: false,
        jumpEffect: false,
        cursorPosition: 0.2,
        curtainLookahead: 0.25,
        isBuiltIn: true
    },
    {
        id: 'display-mode',
        name: 'Display Mode',
        mode: 'PLAYBACK',
        revealMode: 'NOTE',
        darkMode: true,
        isLocked: true,
        highlightNote: true,
        glowEffect: true,
        popEffect: true,
        jumpEffect: true,
        cursorPosition: 0.2,
        curtainLookahead: 0.25,
        isBuiltIn: true
    }
]

export const viewService = {
    // Get all saved views (including defaults)
    getViews(): ViewConfig[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            const userViews: ViewConfig[] = stored ? JSON.parse(stored) : []
            // Merge defaults with user views (defaults first)
            return [...DEFAULT_VIEWS, ...userViews]
        } catch (err) {
            console.error('Failed to load views:', err)
            return DEFAULT_VIEWS
        }
    },

    // Save a new view
    saveView(view: Omit<ViewConfig, 'id' | 'isBuiltIn'>): ViewConfig {
        const newView: ViewConfig = {
            ...view,
            id: `view-${Date.now()}`,
            isBuiltIn: false
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            const userViews: ViewConfig[] = stored ? JSON.parse(stored) : []
            userViews.push(newView)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userViews))
        } catch (err) {
            console.error('Failed to save view:', err)
        }

        return newView
    },

    // Delete a user-created view (can't delete built-ins)
    deleteView(id: string): boolean {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            const userViews: ViewConfig[] = stored ? JSON.parse(stored) : []
            const filtered = userViews.filter(v => v.id !== id)
            if (filtered.length !== userViews.length) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
                return true
            }
        } catch (err) {
            console.error('Failed to delete view:', err)
        }
        return false
    },

    // Get a single view by ID
    getViewById(id: string): ViewConfig | undefined {
        return this.getViews().find(v => v.id === id)
    }
}
