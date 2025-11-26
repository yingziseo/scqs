import 'dotenv/config'

const GLM_API_KEY = process.env.GLM_API_KEY
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export async function callGLM(prompt, options = {}) {
  const { maxRetries = 3, temperature = 0.7 } = options

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GLM_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature,
          max_tokens: 4096,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`GLM API error: ${response.status} - ${error}`)
      }

      const data = await response.json()

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content
      }

      throw new Error('Invalid response format from GLM API')
    } catch (error) {
      console.error(`GLM API attempt ${attempt} failed:`, error.message)

      if (attempt === maxRetries) {
        throw error
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

export function parseTitles(content) {
  console.log('Raw content:', content)
  const titles = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^\d+[.、)）]\s*/, '')) // Remove numbering like "1. " or "1、"
    .map(line => line.replace(/^[-•*]\s*/, '')) // Remove bullet points
    .filter(line => line.length > 5) // Filter out too short lines
    .slice(0, 40) // Limit to 40 titles
  console.log('Parsed titles:', titles)
  return titles
}

export function parseArticle(content) {
  const lines = content.split('\n')
  const sections = []
  let currentSection = null
  let introContent = []
  let foundFirstH2 = false

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/)

    if (h2Match) {
      foundFirstH2 = true
      if (currentSection) {
        currentSection.content = currentSection.content.join('\n').trim()
        sections.push(currentSection)
      }
      currentSection = {
        h2: h2Match[1].trim(),
        content: [],
      }
    } else if (currentSection) {
      currentSection.content.push(line)
    } else if (!foundFirstH2 && line.trim()) {
      introContent.push(line)
    }
  }

  // Push last section
  if (currentSection) {
    currentSection.content = currentSection.content.join('\n').trim()
    sections.push(currentSection)
  }

  // Prepend intro as first section if exists
  const intro = introContent.join('\n').trim()
  if (intro) {
    sections.unshift({
      h2: '',
      content: intro,
    })
  }

  return {
    content,
    sections,
  }
}
