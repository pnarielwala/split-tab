// @flow
import React from 'react'
import { Button, ButtonGroup, ControlLabel } from 'react-bootstrap'
import styles from './Tip.module.scss'

type PropsT = {
  onSelectTip: number => void,
  tipPercent: number,
}

const Tip = (props: PropsT) => {
  const handleSelect = (event: SyntheticMouseEvent<HTMLButtonElement>) =>
    props.onSelectTip(parseFloat(event.currentTarget.value))
  return (
    <div className={styles.container}>
      <ControlLabel>Tip amount</ControlLabel>
      <ButtonGroup className={styles.buttonGroup}>
        <Button
          value="0.1"
          className={styles.button}
          bsStyle={`${props.tipPercent}` === '0.1' ? 'primary' : 'default'}
          onClick={handleSelect}>
          10%
        </Button>
        <Button
          value="0.15"
          className={styles.button}
          bsStyle={`${props.tipPercent}` === '0.15' ? 'primary' : 'default'}
          onClick={handleSelect}>
          15%
        </Button>
        <Button
          value="0.18"
          className={styles.button}
          bsStyle={`${props.tipPercent}` === '0.18' ? 'primary' : 'default'}
          onClick={handleSelect}>
          18%
        </Button>
        <Button
          value="0.2"
          className={styles.button}
          bsStyle={`${props.tipPercent}` === '0.2' ? 'primary' : 'default'}
          onClick={handleSelect}>
          20%
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default Tip
