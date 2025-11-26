import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 180000, // 3 minutes for image generation
})

export interface GenerateTitlesRequest {
  keyword: string
  language: string
  customPrompt?: string  // 用户自定义提示词
}

export interface GenerateTitlesResponse {
  titles: string[]
  taskId: string
}

export interface GenerateArticleRequest {
  taskId: string
  title: string
  keyword: string
  language: string
  minWords: number
  maxWords: number
  minH2: number
  maxH2: number
  minH2Words?: number  // 每个H2段落最小字数
  maxH2Words?: number  // 每个H2段落最大字数
  customPrompt?: string  // 用户自定义提示词
}

export interface ArticleSection {
  h2: string
  content: string
  imageUrl: string | null
  imageBase64: string | null
  imageStatus: 'pending' | 'generating' | 'completed' | 'failed'
}

export interface Article {
  id: string
  title: string
  content: string
  sections: ArticleSection[]
  status: 'pending' | 'generating' | 'completed' | 'failed'
  cover_url?: string | null
  cover_base64?: string | null
  cover_status?: 'pending' | 'generating' | 'completed' | 'failed'
}

export interface GenerateArticleResponse {
  article: Article
}

export interface GenerateImageRequest {
  articleId: string
  sectionIndex: number
  h2Title: string
  keyword?: string
  customPrompt?: string  // 用户自定义提示词
}

export interface GenerateImageResponse {
  success: boolean
  sectionIndex: number
  imageUrl: string
  imageBase64: string
}

export interface GenerateCoverRequest {
  articleId: string
  title: string
  keyword?: string
  customPrompt?: string
}

export interface GenerateCoverResponse {
  success: boolean
  coverUrl: string
  coverBase64: string
}

export interface GenerateAllImagesRequest {
  articleId: string
  keyword?: string
  customPrompt?: string
}

export interface GenerateAllImagesResponse {
  success: boolean
  results: {
    cover: { success: boolean; url?: string; base64?: string; error?: string } | null
    sections: Array<{
      sectionIndex: number
      h2: string
      success: boolean
      url?: string
      error?: string
    }>
  }
}

export const apiService = {
  async generateTitles(data: GenerateTitlesRequest): Promise<GenerateTitlesResponse> {
    const res = await api.post<GenerateTitlesResponse>('/titles/generate', data)
    return res.data
  },

  async generateArticle(data: GenerateArticleRequest): Promise<GenerateArticleResponse> {
    const res = await api.post<GenerateArticleResponse>('/articles/generate', data)
    return res.data
  },

  async regenerateArticle(id: string, data: GenerateArticleRequest): Promise<GenerateArticleResponse> {
    const res = await api.post<GenerateArticleResponse>(`/articles/regenerate/${id}`, data)
    return res.data
  },

  async getArticle(id: string): Promise<{ article: Article }> {
    const res = await api.get<{ article: Article }>(`/articles/${id}`)
    return res.data
  },

  async generateImage(data: GenerateImageRequest): Promise<GenerateImageResponse> {
    const res = await api.post<GenerateImageResponse>('/images/generate', data)
    return res.data
  },

  async generateCover(data: GenerateCoverRequest): Promise<GenerateCoverResponse> {
    const res = await api.post<GenerateCoverResponse>('/images/generate-cover', data)
    return res.data
  },

  async generateAllImages(data: GenerateAllImagesRequest): Promise<GenerateAllImagesResponse> {
    const res = await api.post<GenerateAllImagesResponse>('/images/generate-all', data)
    return res.data
  },

  async exportArticle(id: string): Promise<Blob> {
    const res = await api.post(`/export/article/${id}`, {}, {
      responseType: 'blob',
    })
    return res.data
  },
}

export default api
