export default async function({ response, channel }) {
  // 仅对钉钉通道生效
  if (channel?.type !== 'dingtalk') return response;

  let content = response.content;

  // 如果内容包含 LaTeX 特征（如 \frac, \int, ^, _ 等），尝试包裹 $$
  // 简单策略：如果检测到复杂公式，用 $$...$$；否则用 $...$
  if (content.includes('\\') && !content.includes('$')) {
    // 粗略判断是否为独立公式（多行或含 \frac \int \sum 等）
    if (content.includes('\\frac') || content.includes('\\int') || content.includes('\\sum') || content.includes('\n')) {
      content = `$$\n${content}\n$$`;
    } else {
      // 行内公式
      content = `$${content}$`;
    }
  }

  // 构造钉钉 Markdown 消息体
  return {
    ...response,
    content: content,
    metadata: {
      ...response.metadata,
      dingtalkMsgType: 'markdown'
    }
  };
}