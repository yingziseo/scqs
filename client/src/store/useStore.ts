import { create } from 'zustand'
import type { Article } from '@/lib/api'

type Step = 1 | 2 | 3 | 4 | 5

interface AppState {
  // Current step (1-5)
  currentStep: Step

  // Step 1: Keyword input
  keyword: string
  customPrompt: string  // 用户自定义提示词，描述行业/需求等
  contentLanguage: string
  isGeneratingTitles: boolean

  // Step 2: Title selection (select 5 from 40)
  titles: string[]
  selectedTitles: string[]
  taskId: string | null

  // Step 3: Article config
  minWords: number
  maxWords: number
  minH2: number
  maxH2: number
  minH2Words: number  // 每个H2段落最小字数
  maxH2Words: number  // 每个H2段落最大字数

  // Step 4: Article generation & selection
  articles: Article[]
  selectedArticleId: string | null
  currentGeneratingIndex: number
  isGeneratingArticles: boolean

  // Step 5: Image generation & export
  generatingImageIndex: number | null

  // Actions
  setStep: (step: Step) => void
  goBack: () => void
  setKeyword: (keyword: string) => void
  setCustomPrompt: (customPrompt: string) => void
  setContentLanguage: (language: string) => void
  setIsGeneratingTitles: (value: boolean) => void
  setTitles: (titles: string[], taskId: string) => void
  toggleTitle: (title: string) => void
  selectAllTitles: () => void
  setWordRange: (min: number, max: number) => void
  setH2Range: (min: number, max: number) => void
  setH2WordsRange: (min: number, max: number) => void
  setArticles: (articles: Article[]) => void
  addArticle: (article: Article) => void
  updateArticle: (id: string, article: Partial<Article>) => void
  setSelectedArticleId: (id: string | null) => void
  setIsGeneratingArticles: (value: boolean) => void
  setCurrentGeneratingIndex: (index: number) => void
  setGeneratingImageIndex: (index: number | null) => void
  updateArticleSection: (articleId: string, sectionIndex: number, updates: Partial<Article['sections'][0]>) => void
  updateArticleCover: (articleId: string, coverUrl: string | null, coverBase64: string | null, coverStatus: Article['cover_status']) => void
  reset: () => void
}

const initialState = {
  currentStep: 1 as Step,
  keyword: '',
  customPrompt: '',
  contentLanguage: 'zh',
  isGeneratingTitles: false,
  titles: [],
  selectedTitles: [],
  taskId: null,
  minWords: 800,
  maxWords: 1200,
  minH2: 5,
  maxH2: 8,
  minH2Words: 100,
  maxH2Words: 200,
  articles: [],
  selectedArticleId: null,
  currentGeneratingIndex: -1,
  isGeneratingArticles: false,
  generatingImageIndex: null,
}

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setStep: (currentStep) => set({ currentStep }),

  goBack: () => set((state) => ({
    currentStep: Math.max(1, state.currentStep - 1) as Step,
  })),

  setKeyword: (keyword) => set({ keyword }),

  setCustomPrompt: (customPrompt) => set({ customPrompt }),

  setContentLanguage: (contentLanguage) => set({ contentLanguage }),

  setIsGeneratingTitles: (isGeneratingTitles) => set({ isGeneratingTitles }),

  setTitles: (titles, taskId) => set({
    titles,
    taskId,
    selectedTitles: [],
    articles: [],
    selectedArticleId: null,
    currentStep: 2,
  }),

  toggleTitle: (title) => set((state) => {
    const isSelected = state.selectedTitles.includes(title)
    if (isSelected) {
      return { selectedTitles: state.selectedTitles.filter((t) => t !== title) }
    }
    // Limit to 5 selections
    if (state.selectedTitles.length >= 5) {
      return state
    }
    return { selectedTitles: [...state.selectedTitles, title] }
  }),

  selectAllTitles: () => set((state) => {
    // Select first 5 titles or clear
    if (state.selectedTitles.length === 5) {
      return { selectedTitles: [] }
    }
    return { selectedTitles: state.titles.slice(0, 5) }
  }),

  setWordRange: (minWords, maxWords) => set({ minWords, maxWords }),

  setH2Range: (minH2, maxH2) => set({ minH2, maxH2 }),

  setH2WordsRange: (minH2Words, maxH2Words) => set({ minH2Words, maxH2Words }),

  setArticles: (articles) => set({ articles }),

  addArticle: (article) => set((state) => ({
    articles: [...state.articles, article],
  })),

  updateArticle: (id, updates) => set((state) => ({
    articles: state.articles.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    ),
  })),

  setSelectedArticleId: (selectedArticleId) => set({ selectedArticleId }),

  setIsGeneratingArticles: (isGeneratingArticles) => set({ isGeneratingArticles }),

  setCurrentGeneratingIndex: (currentGeneratingIndex) => set({ currentGeneratingIndex }),

  setGeneratingImageIndex: (generatingImageIndex) => set({ generatingImageIndex }),

  updateArticleSection: (articleId, sectionIndex, updates) => set((state) => ({
    articles: state.articles.map((a) => {
      if (a.id !== articleId) return a
      const newSections = [...a.sections]
      newSections[sectionIndex] = { ...newSections[sectionIndex], ...updates }
      return { ...a, sections: newSections }
    }),
  })),

  updateArticleCover: (articleId, coverUrl, coverBase64, coverStatus) => set((state) => ({
    articles: state.articles.map((a) =>
      a.id === articleId ? { ...a, cover_url: coverUrl, cover_base64: coverBase64, cover_status: coverStatus } : a
    ),
  })),

  reset: () => set(initialState),
}))
