// @flow
import React, { Component } from 'react'
import { FormControl, Button } from 'react-bootstrap'
import styles from './AddParticipant.module.scss'

type PropsT = {
  onAdd: (participant: {
    id: string,
    name: string,
    amount: number,
    totalAmount: number,
  }) => void,
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
          <FormControl
            autoFocus
            value={this.state.participant}
            onChange={this.onInputChange}
          />
          <Button className={styles.button} type="submit" bsStyle="success">
            Add
          </Button>
        </form>
      </div>
    )
  }
}

export default AddParticipant
