import 'dotenv/config'

const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY
// 豆包文生图模型 - 使用官方推荐的 seedream 模型
const DOUBAO_MODEL = process.env.DOUBAO_MODEL || 'doubao-seedream-3-0-t2i-250415'

// 豆包文生图API
export async function generateImage(prompt, options = {}) {
  const { maxRetries = 3 } = options

  // 构建更详细的图片描述提示词
  const enhancedPrompt = `高质量专业插图，主题：${prompt}。风格：现代简洁，商业插画风格，适合文章配图，色彩明亮，构图清晰，1:1正方形构图`

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DOUBAO_API_KEY}`,
        },
        body: JSON.stringify({
          model: DOUBAO_MODEL,
          prompt: enhancedPrompt,
          size: '2048x2048', // 2K 1:1 正方形，高质量
          response_format: 'url',
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Doubao API error: ${response.status} - ${error}`)
      }

      const data = await response.json()

      if (data.data && data.data[0]) {
        return {
          url: data.data[0].url,
          revised_prompt: data.data[0].revised_prompt || prompt,
        }
      }

      throw new Error('Invalid response format from Doubao API')
    } catch (error) {
      console.error(`Doubao API attempt ${attempt} failed:`, error.message)

      if (attempt === maxRetries) {
        throw error
      }

      await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
    }
  }
}

// 下载图片并转为base64
export async function downloadImageAsBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`)
    }
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const contentType = response.headers.get('content-type') || 'image/png'
    return {
      base64,
      contentType,
      buffer: Buffer.from(buffer),
    }
  } catch (error) {
    console.error('Failed to download image:', error.message)
    throw error
  }
}
