import React from 'react'
import { Composition } from 'remotion'
import { HeroLoop } from './HeroLoop'

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HeroLoop"
    component={HeroLoop}
    durationInFrames={240} // 8s @ 30fps — every element is periodic over this span
    fps={30}
    width={1080}
    height={1350} // 4:5, matching the hero plate
  />
)
