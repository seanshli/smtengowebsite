import React from 'react'
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'

// enGo brand
const ORANGE = '#e05a35'
const ORANGE2 = '#FE8B05'
const NAVY = '#152939'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// One elegant wire crossing the lower third, ending at a hub node.
// Coordinates are in the 1080x1350 frame space.
const WIRE = 'M -40 1120 C 260 1020, 420 1180, 620 1090 S 900 980, 1000 1010'
const HUB = { x: 1000, y: 1010 }

/**
 * Everything in this composition is periodic over the full duration, so the
 * rendered mp4 loops without a seam:
 *   - photo zoom breathes on a cosine (1 full cycle)
 *   - pulse dots travel the wire on frame/duration phase (integer laps)
 *   - hub halo pulses on a sine (integer cycles)
 * The wire itself stays fully drawn — the draw-in moment belongs to the
 * on-page scroll scene, not the loop.
 */
export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const t = frame / durationInFrames // 0..1, loops

  const zoom = 1.045 + 0.035 * Math.cos(2 * Math.PI * t) // one breath per loop
  const hubPulse = 1 + 0.18 * Math.sin(2 * Math.PI * 3 * t) // 3 pulses per loop

  // Two travelers, opposite phases, 2 laps each per loop.
  const dots = [0, 0.5].map((phase) => ((t * 2 + phase) % 1) * 100)

  return (
    <AbsoluteFill style={{ backgroundColor: '#fdf5ec' }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img
          src={staticFile('hero-home.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* warm vignette to seat the plate into the cream page */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 90% at 50% 38%, rgba(253,245,236,0) 55%, rgba(21,41,57,0.18) 100%)'
        }}
      />

      {/* living wire + travelers + hub */}
      <AbsoluteFill>
        <svg viewBox="0 0 1080 1350" width="100%" height="100%" fill="none">
          <path d={WIRE} stroke={ORANGE} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
          <circle cx={HUB.x} cy={HUB.y} r={26 * hubPulse} fill="rgba(224,90,53,0.25)" />
          <circle cx={HUB.x} cy={HUB.y} r={14} fill={NAVY} />
        </svg>
        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderRadius: 8,
              background: ORANGE2,
              boxShadow: '0 0 18px 4px rgba(254,139,5,0.55)',
              offsetPath: `path('${WIRE}')`,
              offsetDistance: `${d}%`
            }}
          />
        ))}
      </AbsoluteFill>

      {/* paper grain, matching the site hero */}
      <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.05 }} />
    </AbsoluteFill>
  )
}
