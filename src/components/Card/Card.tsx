import style from './Card.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faXmark } from '@fortawesome/free-solid-svg-icons'

interface parkProps {
  name: string
  onCloseClick: React.MouseEventHandler<SVGSVGElement> | undefined
  address: string
  payex: string
  carSpace: number
  motorSpace: number
  update: number
  href: string
  time: number
}

export default function Card(props: parkProps) {
  return (
    <div className={style.card}>
      <div>
        <h3>
          {props.name}
          <FontAwesomeIcon
            icon={faXmark}
            className={style.close}
            onClick={props.onCloseClick}
            size="lg"
          />
        </h3>
        <p>{props.address}</p>
        <p>
          剩餘汽車位：{props.carSpace}｜剩餘機車位：{props.motorSpace}
        </p>
        <p>收費方式：{props.payex}</p>
        <p>
          資料更新時間：{props.update}｜自動更新於： {props.time} 秒前
        </p>
        <a
          href={props.href}
          target="_blank"
          rel="noreferrer"
          className={style.button}
        >
          <FontAwesomeIcon icon={faCar} /> 開始導航
        </a>
      </div>
    </div>
  )
}
