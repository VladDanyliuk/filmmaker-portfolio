interface VideoEmbedProps {
  url: string
  title?: string
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return match?.[1] ?? null
}

export function VideoEmbed({ url, title = 'Video' }: VideoEmbedProps) {
  const videoId = getYouTubeId(url)

  if (!videoId) return null

  return (
    <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-bg-secondary border border-glass">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  )
}
