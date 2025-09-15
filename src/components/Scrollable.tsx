import React from 'react'
import {ReactLenis} from "lenis/react";

const Scrollable:React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <ReactLenis root options={{lerp: 0.5}}>
      {children}
    </ReactLenis>
  )
}

export default Scrollable