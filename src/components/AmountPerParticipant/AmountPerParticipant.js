// @flow
import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import styles from './AmountPerParticipant.module.scss'

type ParticipantT = {
  id: string,
  name: string,
}

type PropsT = {
  participants: {
    [key: string]: ParticipantT,
  },
  totalsPerParticipant: {
    [key: string]: number,
  },
  onEditClick: (id: string) => void,
}

const AmountPerParticipant = (props: PropsT) => {
  const totals = Object.entries(props.totalsPerParticipant)
  return (
    <div className={styles.container}>
      {totals.length > 0 ? (
        totals.map(idAndTotal => {
          const [participantId, total] = idAndTotal
          return (
            <div key={participantId} className={styles.line}>
              <div>
                <Button
                  onClick={() => props.onEditClick(participantId)}
                  className={styles.edit}
                  bsSize="small">
                  <Glyphicon glyph="pencil" />
                </Button>
                {props.participants[participantId].name}
              </div>
              <div>{`$${total.toFixed(2)}`}</div>
            </div>
          )
        })
      ) : (
        <div>Please add participants</div>
      )}
    </div>
  )
}

export default AmountPerParticipant
