import { RequestHandler } from 'express'
import { WebClient } from '@slack/web-api'

const ClaudeChannel = 'D0627AM8TJ5' // 频道

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(void 0)
    }, ms)
  })
}

const web = new WebClient(
  'xoxp-6062607938691-6085696331968-6065491804996-803f591d4db86f6b1e4305167ff5ece8'
)

export const withClaude: RequestHandler = async (req, res, next) => {
  const { content } = req.query
  const result = await web.chat.postMessage({
    text: content as string,
    channel: 'U061X507M1S', // who
  })
  if (result.ok) {
    for (let i = 0; i < 40; i++) {
      const bot = await web.conversations.history({
        channel: ClaudeChannel,
        oldest: result.ts,
        limit: 1,
      })
      const conversation = bot.messages
      if (!conversation) {
        await sleep(500)
      } else if (!conversation.length) {
        await sleep(500)
      } else if (
        Array.isArray(conversation) &&
        conversation.length &&
        conversation[0].text?.includes('Typing')
      ) {
        await sleep(500)
      } else {
        res.send(conversation[0].text)
        return
      }
    }
    // 500 * 40 = 20000 (20s)
    res.send('timeout!')
  } else {
    res.send(result.error)
  }
}
