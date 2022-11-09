import { MouseEventHandler } from 'react'
import style from './Filter.module.css'

interface onClickProp {
  allClick: MouseEventHandler<HTMLButtonElement> | undefined
  carClick: MouseEventHandler<HTMLButtonElement> | undefined
  motorClick: MouseEventHandler<HTMLButtonElement> | undefined
}

export default function FilterButton(props: onClickProp) {
  return (
    <div className={style.bar}>
      <button onClick={props.allClick} className={style.button}>
        All
      </button>
      <button onClick={props.carClick} className={style.button}>
        Car
      </button>
      <button onClick={props.motorClick} className={style.button}>
        Motor
      </button>
    </div>
  )
}
