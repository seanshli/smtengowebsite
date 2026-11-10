/** Display title of a knowledge-base video. `title` is the video's own (Traditional Chinese) title on YouTube;
 *  `titles` carries the Simplified Chinese and English display titles. ja / fr / es read the English one. */
export const videoTitle = (video: { title: string; titles?: { zhCN?: string; en?: string } }, locale: string): string => {
  if (locale === 'zh') return video.title
  if (locale === 'zhCN') return video.titles?.zhCN ?? video.title
  return video.titles?.en ?? video.title
}
