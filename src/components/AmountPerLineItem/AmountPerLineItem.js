// @flow
import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import styles from './AmountPerLineItem.module.scss'

type LineItemT = {
  id: string,
  label: string,
  amount: number,
}

type PropsT = {
  lineItems: Array<LineItemT>,
  onEditClick: (id: string) => void,
}

const AmountPerParticipant = (props: PropsT) => {
  return (
    <div className={styles.container}>
      {props.lineItems.length > 0 ? (
        props.lineItems.map((item, index) => {
          return (
            <div key={item.id} className={styles.line}>
              <div>
                <Button
                  onClick={() => props.onEditClick(item.id)}
                  className={styles.edit}
                  bsSize="small">
                  <Glyphicon glyph="pencil" />
                </Button>
                {item.label}
              </div>
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
