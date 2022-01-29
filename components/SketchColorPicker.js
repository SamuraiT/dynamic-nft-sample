import { SketchPicker } from 'react-color'
import React, { useEffect, useState } from "react"
import reactCSS from 'reactcss'

const rgb2Text = ({r,g,b,a}) => {
  return `rgb(${r},${g},${b},${a})`
}

const SketchColorPicker = ({color,setColor}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  const styles = reactCSS({
    'default': {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `${color}`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <>
      <div style={ styles.swatch } onClick={() => setDisplayColorPicker(!displayColorPicker) }>
        <div style={ styles.color } />
      </div>
      { displayColorPicker && (
        <div style={ styles.popover }>
          <div style={ styles.cover } onClick={() => {setDisplayColorPicker(false)} }/>
          <SketchPicker color={ color } onChange={({rgb}) =>  setColor(rgb2Text(rgb))} />
        </div>
      ) }
    </>
  )
}


export default SketchColorPicker
