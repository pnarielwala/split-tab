// @flow
import React from 'react'
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
              <div>{props.participants[participantId].name}</div>
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
