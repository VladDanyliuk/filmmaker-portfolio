interface VideoEmbedProps {
  url: string
  title?: string
}

function getYouTubeId(url: string): string | null {
  // Handles watch?v=ID, youtu.be/ID, and Shorts (youtube.com/shorts/ID).
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([^&?/]+)/)
  return match?.[1] ?? null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match?.[1] ?? null
}

export function VideoEmbed({ url, title = 'Video' }: VideoEmbedProps) {
  const youtubeId = getYouTubeId(url)
  const vimeoId = youtubeId ? null : getVimeoId(url)

  if (!youtubeId && !vimeoId) return null

  const src = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=FF8A3D&title=0&byline=0&portrait=0`

  return (
    <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-bg-secondary border border-glass">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  )
}
