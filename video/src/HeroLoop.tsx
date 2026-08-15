import React from 'react'
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'

const NAVY = '#152939'
const CREAM = '#f6ead8'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * The cutaway illustration is a 1408x768 landscape centered on a 1080x1350
 * canvas, so original-art coordinates map via:
 *   final = (0.767 * x, 380.5 + 0.767 * y)
 * Landmarks below were read off the rendered art with that mapping.
 */
const P = (x: number, y: number): [number, number] => [0.767 * x, 380.5 + 0.767 * y]

const BEDROOM_LAMP = P(430, 300)
const LIVING_LIGHT = P(520, 470)
const KITCHEN_PENDANTS = P(895, 465)
const STUDY_LAMP = P(940, 300)
const GROUND_Y = 380.5 + 0.767 * 672
const DOOR_X = 0.767 * 1052

// room interiors, original-art boxes mapped to final coordinates
const ROOM = (x: number, y: number, w: number, h: number) =>
  ({ x: 0.767 * x, y: 380.5 + 0.767 * y, w: 0.767 * w, h: 0.767 * h })
const LIVING_ROOM = ROOM(320, 420, 370, 235)
const BEDROOM = ROOM(352, 212, 150, 135)
const KITCHEN = ROOM(782, 385, 245, 270)

// bedroom window (for the curtain panels), original-art box
const WIN = { x: 0.767 * 505, y: 380.5 + 0.767 * 228, w: 0.767 * 110, h: 0.767 * 78 }

// smooth on/off window: 0 outside [a,b], eases over f — and 0 at t=0 and
// t=1, which is what keeps every cue loop-safe.
const box = (t: number, a: number, b: number, f: number) =>
  Math.max(0, Math.min(1, Math.min(t - a, b - t) / f))

// A room region that visibly darkens when its light is off (multiply veil)
const Dim: React.FC<{ x: number; y: number; w: number; h: number; on: number }> = ({ x, y, w, h, on }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      background: 'rgba(21,41,57,0.22)',
      mixBlendMode: 'multiply',
      borderRadius: 6,
      opacity: 1 - on
    }}
  />
)

const Glow: React.FC<{ at: [number, number]; r: number; o: number; warm?: boolean }> = ({ at, r, o, warm }) => (
  <div
    style={{
      position: 'absolute',
      left: at[0],
      top: at[1],
      width: r * 2,
      height: r * 2,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(255,${warm ? 176 : 205},${warm ? 64 : 110},0.6), transparent 68%)`,
      mixBlendMode: 'screen',
      opacity: o
    }}
  />
)

/**
 * A day in the loop (8s):
 *   t .05–.30  someone walks home along the ground line
 *   t .30      the living-room light greets them (on while occupied)
 *   t .55–.80  they head back out — living light off behind them
 *   t .60      the bedroom lamp comes on upstairs…
 *   t .62–.96  …and the bedroom curtains draw closed for the night
 *   kitchen pendants & study lamp cycle on their own schedules
 * Everything is a pure function of t with equal state at t=0 and t=1.
 */
export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const t = frame / durationInFrames

  const zoom = 1.04 + 0.03 * Math.cos(2 * Math.PI * t)

  // occupancy story
  const inProg = Math.max(0, Math.min(1, (t - 0.05) / 0.25))
  const outProg = Math.max(0, Math.min(1, (t - 0.55) / 0.25))
  const walkingIn = t >= 0.05 && t <= 0.3
  const walkingOut = t >= 0.55 && t <= 0.8
  const personX = walkingIn ? 900 - (900 - DOOR_X) * inProg : DOOR_X + (900 - DOOR_X) * outProg
  const personVisible = walkingIn || walkingOut
    ? box(t, walkingIn ? 0.05 : 0.55, walkingIn ? 0.3 : 0.8, 0.03)
    : 0
  const bob = 3 * Math.sin(2 * Math.PI * 24 * t)

  // lighting automation
  const livingOn = box(t, 0.3, 0.57, 0.05) // on while home, off after leaving
  const bedroomOn = box(t, 0.6, 0.97, 0.05) // evening upstairs
  const kitchenOn = Math.max(box(t, 0.12, 0.46, 0.07), box(t, 0.72, 0.9, 0.07))
  const studyOn = box(t, 0.4, 0.86, 0.08)

  // curtains draw closed after the bedroom lamp comes on
  const curtain = box(t, 0.62, 0.96, 0.06)
  const panelW = (WIN.w / 2) * curtain

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8f0e3' }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img
          src={staticFile('hero-home.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* lighting automation: rooms dim when empty, light when occupied */}
        <Dim x={LIVING_ROOM.x} y={LIVING_ROOM.y} w={LIVING_ROOM.w} h={LIVING_ROOM.h} on={livingOn} />
        <Dim x={BEDROOM.x} y={BEDROOM.y} w={BEDROOM.w} h={BEDROOM.h} on={bedroomOn} />
        <Dim x={KITCHEN.x} y={KITCHEN.y} w={KITCHEN.w} h={KITCHEN.h} on={kitchenOn} />
        <Glow at={LIVING_LIGHT} r={150} o={0.95 * livingOn} warm />
        <Glow at={BEDROOM_LAMP} r={95} o={livingOn ? 0.95 * bedroomOn : 0.95 * bedroomOn} warm />
        <Glow at={KITCHEN_PENDANTS} r={110} o={0.85 * kitchenOn} warm />
        <Glow at={STUDY_LAMP} r={75} o={0.75 * studyOn} />

        {/* bedroom curtains drawing closed */}
        <div style={{ position: 'absolute', left: WIN.x, top: WIN.y, width: panelW, height: WIN.h, background: CREAM, borderRight: `2px solid ${NAVY}`, opacity: curtain > 0.02 ? 1 : 0 }} />
        <div style={{ position: 'absolute', left: WIN.x + WIN.w - panelW, top: WIN.y, width: panelW, height: WIN.h, background: CREAM, borderLeft: `2px solid ${NAVY}`, opacity: curtain > 0.02 ? 1 : 0 }} />

        {/* the resident, coming home and heading out */}
        <div style={{ position: 'absolute', left: personX, top: GROUND_Y - 52 + bob * 0.5, opacity: personVisible, transform: walkingOut ? 'scaleX(-1)' : undefined }}>
          <div style={{ width: 19, height: 19, borderRadius: '50%', background: NAVY, margin: '0 auto 2px' }} />
          <div style={{ width: 22, height: 32, borderRadius: '10px 10px 4px 4px', background: NAVY }} />
        </div>
      </AbsoluteFill>

      {/* warm vignette seats the plate into the cream page */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, rgba(253,245,236,0) 58%, rgba(21,41,57,0.14) 100%)'
        }}
      />

      {/* paper grain, matching the site */}
      <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.05 }} />
    </AbsoluteFill>
  )
}
