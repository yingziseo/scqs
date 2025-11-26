export const prompts = {
  generateTitles(keyword, language, customPrompt) {
    const languageNames = {
      zh: '中文',
      en: 'English',
      ja: '日本語',
      ko: '한국어',
      fr: 'Français',
      de: 'Deutsch',
      es: 'Español',
      pt: 'Português',
      ru: 'Русский',
      it: 'Italiano',
      nl: 'Nederlands',
      pl: 'Polski',
      tr: 'Türkçe',
      ar: 'العربية',
      th: 'ไทย',
      vi: 'Tiếng Việt',
      id: 'Bahasa Indonesia',
      ms: 'Bahasa Melayu',
      hi: 'हिन्दी',
      he: 'עברית',
    }

    const langName = languageNames[language] || language

    // Build custom context section if provided
    const customContext = customPrompt
      ? `\n\n【用户补充说明】\n${customPrompt}\n请根据以上说明，生成更贴合用户需求和行业特点的标题。`
      : ''

    return `你是一位专业的SEO内容策划专家。请为关键词「${keyword}」生成40个具有高搜索价值的文章标题。

要求：
1. 标题必须包含主关键词「${keyword}」
2. 标题要吸引点击，具有价值感和专业性
3. 标题必须使用${langName}语言
4. 涵盖不同角度：教程指南、对比评测、推荐清单、常见问答、深度分析、最新趋势、实战案例等
5. 标题长度控制在15-40字符（根据语言特性调整）
6. 避免标题过于相似，要有明显差异化
7. 每个标题都要有独特卖点${customContext}

请直接输出40个标题，每行一个，不要编号，不要添加任何解释。必须输出完整的40个标题，不能少于40个。`
  },

  generateArticle(title, keyword, language, minWords, maxWords, minH2, maxH2, minH2Words, maxH2Words, customPrompt) {
    const languageNames = {
      zh: '中文',
      en: 'English',
      ja: '日本語',
      ko: '한국어',
      fr: 'Français',
      de: 'Deutsch',
      es: 'Español',
      pt: 'Português',
      ru: 'Русский',
      it: 'Italiano',
      nl: 'Nederlands',
      pl: 'Polski',
      tr: 'Türkçe',
      ar: 'العربية',
      th: 'ไทย',
      vi: 'Tiếng Việt',
      id: 'Bahasa Indonesia',
      ms: 'Bahasa Melayu',
      hi: 'हिन्दी',
      he: 'עברית',
    }

    const langName = languageNames[language] || language

    // Build custom context section if provided
    const customContext = customPrompt
      ? `\n\n【用户补充说明】\n${customPrompt}\n请根据以上说明，撰写更贴合用户需求和行业特点的文章内容。`
      : ''

    // 计算每个H2段落的平均字数
    const avgH2Count = Math.ceil((minH2 + maxH2) / 2)
    const h2WordsMin = minH2Words || Math.floor((minWords - 250) / avgH2Count)
    const h2WordsMax = maxH2Words || Math.floor((maxWords - 250) / avgH2Count)

    return `你是一位专业的SEO内容撰写专家。请根据以下要求撰写一篇高质量的SEO优化文章。

【文章信息】
标题：${title}
主关键词：${keyword}
语言：${langName}
文章总字数要求：${minWords}-${maxWords}字（这是硬性要求，必须达到）
H2标题数量：${minH2}-${maxH2}个
每个H2段落字数：${h2WordsMin}-${h2WordsMax}字${customContext}

【文章结构要求】
1. 开篇引言（150-200字）：直接开始写引言内容，自然引入主题，包含主关键词，说明文章将要解决的问题
2. 正文部分：${minH2}-${maxH2}个H2小标题，每个H2小标题下的段落内容必须达到${h2WordsMin}-${h2WordsMax}字
3. 结尾总结（100-150字）：总结全文要点，引导用户行动

【字数硬性要求】
- 文章总字数必须达到${minWords}字以上
- 每个H2段落必须有实质性内容，不能敷衍
- 如果字数不够，请增加段落深度、案例说明、操作步骤等

【SEO优化要求】
1. 主关键词「${keyword}」在文章中自然出现5-8次
2. 自然融入3-5个与主关键词相关的长尾关键词变体
3. 段落清晰，句子通顺，易于阅读
4. 内容要有实际价值，提供有用信息，避免空洞堆砌
5. H2标题要包含关键词变体，具有吸引力，适合作为配图主题

【重要】输出格式要求：
- 直接输出文章内容，不要输出任何标签、占位符或说明文字
- 不要输出类似"[开篇引言]"、"[H2标题1]"这样的占位符
- H2标题使用Markdown格式：## 标题内容
- 段落之间用空行分隔
- 确保文章完整，字数达标

请直接开始写文章内容：`
  },

  // 生成文章封面图的提示词
  generateCoverImagePrompt(title, keyword, customPrompt) {
    let prompt = `专业商业插画，文章封面图，主题：${title}，关键词：${keyword}`
    if (customPrompt) {
      prompt += `，风格说明：${customPrompt}`
    }
    return prompt
  },

  // 生成H2配图的提示词
  generateH2ImagePrompt(h2Title, keyword, customPrompt) {
    let prompt = `专业商业插画，段落配图，主题：${h2Title}，关键词：${keyword}`
    if (customPrompt) {
      prompt += `，风格说明：${customPrompt}`
    }
    return prompt
  },
}
