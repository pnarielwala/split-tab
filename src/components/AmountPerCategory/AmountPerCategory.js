// @flow
import React from 'react'
import styles from './AmountPerCategory.module.scss'

type PropsT = {
  subtotal: number,
  tip: number,
  tax: number,
  total: number,
}

const AmountPerParticipant = (props: PropsT) => {
  return (
    <div className={styles.container}>
      <div className={styles.line}>
        <div>Subtotal</div>
        <div>{`$${props.subtotal.toFixed(2)}`}</div>
      </div>
      <div className={styles.line}>
        <div>Tip</div>
        <div>{`$${props.tip.toFixed(2)}`}</div>
      </div>
      <div className={styles.line}>
        <div>Tax</div>
        <div>{`$${props.tax.toFixed(2)}`}</div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.line}>
        <div>Total</div>
        <div>{`$${props.total.toFixed(2)}`}</div>
      </div>
    </div>
  )
}

export default AmountPerParticipant
