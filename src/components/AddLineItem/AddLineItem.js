// @flow
import React, { Component } from 'react'
import { FormControl, Button, InputGroup } from 'react-bootstrap'
import styles from './AddLineItem.module.scss'

type ParticipantT = {
  id: string,
  name: string,
}

type LineItemT = {
  id: string,
  participants: Array<string>,
  amount: number,
}

type PropsT = {
  participants: Array<ParticipantT>,
  onAdd: LineItemT => void,
  onCancel: () => void,
}

type StateT = {
  selectedParticipants: Array<string>,
  amount: string,
}

class AddLineItem extends Component<PropsT, StateT> {
  state = {
    selectedParticipants: [],
    amount: '',
  }

  onInputChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (/^\d*[.]?\d{0,2}$/.test(value)) this.setState({ amount: value })
  }

  createUUID = () =>
    Math.random()
      .toString(36)
      .substring(2)

  handleOnAddClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    this.props.onAdd({
      id: this.createUUID(),
      amount: parseFloat(this.state.amount),
      participants: this.state.selectedParticipants,
    })
  }

  onParticipantClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value
    const alreadySelected = this.state.selectedParticipants.find(
      p => p === value,
    )

    const selectedParticipants = !alreadySelected
      ? [...this.state.selectedParticipants, value]
      : this.state.selectedParticipants.filter(p => p !== value)
    this.setState({
      selectedParticipants,
    })
  }

  render() {
    const { participants } = this.props
    return (
      <div className={styles.container}>
        <h2>Add a new line item</h2>
        <form className={styles.form} onSubmit={this.handleOnAddClick}>
          <InputGroup className={styles.input}>
            <InputGroup.Addon>$</InputGroup.Addon>
            <FormControl
              autoFocus
              value={this.state.amount}
              onChange={this.onInputChange}
            />
          </InputGroup>
          <div className={styles.participantsContainer}>
            <div>Participants: </div>
            {participants.map((participant, index) => (
              <Button
                key={index}
                value={participant.id}
                bsStyle={
                  this.state.selectedParticipants.find(
                    pId => pId === participant.id,
                  )
                    ? 'primary'
                    : 'default'
                }
                onClick={this.onParticipantClick}>
                {participant.name}
              </Button>
            ))}
          </div>
          <Button className={styles.button} type="submit" bsStyle="success">
            Add
          </Button>
          <Button
            className={styles.button}
            onClick={this.props.onCancel}
            bsStyle="default">
            Cancel
          </Button>
        </form>
      </div>
    )
  }
}

export default AddLineItem
