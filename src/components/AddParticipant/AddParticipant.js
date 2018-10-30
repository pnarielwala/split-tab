// @flow
import React, { Component } from 'react'
import { FormControl, Button, ControlLabel } from 'react-bootstrap'
import styles from './AddParticipant.module.scss'

type PropsT = {
  onAdd: (participant: {
    id: string,
    name: string,
    amount: number,
    totalAmount: number,
  }) => void,
  onCancel: () => void,
}

type StateT = {
  participant: string,
}

class AddParticipant extends Component<PropsT, StateT> {
  state = {
    participant: '',
  }

  onInputChange = (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ participant: event.target.value })

  createUUID = () =>
    Math.random()
      .toString(36)
      .substring(2)

  handleOnAddClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    this.props.onAdd({
      id: this.createUUID(),
      name: this.state.participant,
      amount: 0,
      totalAmount: 0,
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <h2>Add a new participant</h2>
        <form className={styles.form} onSubmit={this.handleOnAddClick}>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            autoFocus
            placeholder="ex. Bob"
            value={this.state.participant}
            onChange={this.onInputChange}
            required
          />
          <div className={styles.buttonContainer}>
            <Button className={styles.button} type="submit" bsStyle="success">
              Add
            </Button>
            <Button
              className={styles.button}
              onClick={this.props.onCancel}
              bsStyle="default">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

export default AddParticipant
