import React, { useRef } from 'react'
import { OnClick } from 'react-hook-core'
import { FileInfo } from 'reactx-upload'
import "./item.css"

interface Props {
  items: FileInfo[],
  setCurrentImage: (index: number, isClick: boolean) => void,
  currentImage: number,
  handleHoverImage: (index: number, isClick: boolean) => void,
}
export const ItemSlider = ({ items, setCurrentImage, currentImage, handleHoverImage }: Props) => {

  const ref = useRef<any>()
  const scroll = (e: OnClick, dir: string) => {
    e.preventDefault()
    const { current } = ref
    if (dir === 'up') {
      current.scrollTop -= 300
    } else {
      current.scrollTop += 300
    }
  }
  return (
    <div className='item-slider'>
      <div className='item-list' ref={ref}>
        {items.map((i, index: number) => (
          <div key={index}>
            <img className={currentImage === index ? 'image-selected' : ''} src={i.url} alt="" onMouseEnter={() => handleHoverImage(index, false)} onClick={() => setCurrentImage(index, true)} />
          </div>
        ))}
      </div>
      <div className='button-item-prev' onClick={e => scroll(e, 'up')}> <i className='material-icons'>expand_less</i></div>
      <div className='button-item-next' onClick={e => scroll(e, 'down')}><i className="material-icons">
        keyboard_arrow_down
      </i></div>
    </div>
  )
}