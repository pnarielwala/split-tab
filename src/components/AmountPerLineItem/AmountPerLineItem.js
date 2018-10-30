// @flow
import React from 'react'
import styles from './AmountPerLineItem.module.scss'

type LineItemT = {
  label: string,
  amount: number,
}

type PropsT = {
  lineItems: Array<LineItemT>,
}

const AmountPerParticipant = (props: PropsT) => {
  return (
    <div className={styles.container}>
      {props.lineItems.length > 0 ? (
        props.lineItems.map((item, index) => {
          return (
            <div key={index} className={styles.line}>
              <div>{item.label}</div>
              <div>{`$${item.amount.toFixed(2)}`}</div>
            </div>
          )
        })
      ) : (
        <div>Please add line items</div>
      )}
    </div>
  )
}

export default AmountPerParticipant
