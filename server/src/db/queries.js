import db from './init.js'
import { v4 as uuidv4 } from 'uuid'

export const queries = {
  // Tasks
  createTask(keyword, language, minWords, maxWords) {
    const id = uuidv4()
    const stmt = db.prepare(`
      INSERT INTO tasks (id, keyword, language, min_words, max_words)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(id, keyword, language, minWords, maxWords)
    return id
  },

  getTask(id) {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?')
    return stmt.get(id)
  },

  // Articles
  createArticle(taskId, title) {
    const id = uuidv4()
    const stmt = db.prepare(`
      INSERT INTO articles (id, task_id, title, status)
      VALUES (?, ?, ?, 'pending')
    `)
    stmt.run(id, taskId, title)
    return id
  },

  updateArticle(id, content, sections, status) {
    const stmt = db.prepare(`
      UPDATE articles
      SET content = ?, sections = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    stmt.run(content, JSON.stringify(sections), status, id)
  },

  updateArticleSections(id, sections) {
    const stmt = db.prepare(`
      UPDATE articles
      SET sections = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    stmt.run(JSON.stringify(sections), id)
  },

  updateArticleCover(id, coverUrl, coverBase64, coverStatus) {
    const stmt = db.prepare(`
      UPDATE articles
      SET cover_url = ?, cover_base64 = ?, cover_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    stmt.run(coverUrl, coverBase64, coverStatus, id)
  },

  getArticle(id) {
    const stmt = db.prepare('SELECT * FROM articles WHERE id = ?')
    const article = stmt.get(id)
    if (article && article.sections) {
      article.sections = JSON.parse(article.sections)
    }
    return article
  },

  getArticlesByTaskId(taskId) {
    const stmt = db.prepare('SELECT * FROM articles WHERE task_id = ? ORDER BY created_at')
    const articles = stmt.all(taskId)
    return articles.map(a => ({
      ...a,
      sections: a.sections ? JSON.parse(a.sections) : []
    }))
  },

  getArticlesByIds(ids) {
    const placeholders = ids.map(() => '?').join(',')
    const stmt = db.prepare(`SELECT * FROM articles WHERE id IN (${placeholders})`)
    const articles = stmt.all(...ids)
    return articles.map(a => ({
      ...a,
      sections: a.sections ? JSON.parse(a.sections) : []
    }))
  },

  deleteArticle(id) {
    const stmt = db.prepare('DELETE FROM articles WHERE id = ?')
    stmt.run(id)
  },
}
