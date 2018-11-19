// @flow
import React, { Component } from 'react'
import { FormControl, Button, ControlLabel, Checkbox } from 'react-bootstrap'
import styles from './AddParticipant.module.scss'

type PropsT = {
  participant?: {
    id: string,
    name: string,
  },
  onSave: (participant: {
    id: string,
    name: string,
  }) => void,
  onCancel: () => void,
}

type StateT = {
  id: string,
  participant: string,
  canAddMore: boolean,
}

class AddParticipant extends Component<PropsT, StateT> {
  nameInput: { current: null | HTMLInputElement }
  constructor(props: PropsT) {
    super(props)

    this.nameInput = React.createRef()
    this.state = {
      id: props.participant ? props.participant.id : this.createUUID(),
      participant: props.participant ? props.participant.name : '',
      canAddMore: false,
    }
  }

  onInputChange = (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ participant: event.target.value })

  toggleAddMore = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState(prevState => ({ canAddMore: !prevState.canAddMore }))
  }

  createUUID = () =>
    Math.random()
      .toString(36)
      .substring(2)

  clearForm = () =>
    this.setState(
      {
        id: this.createUUID(),
        participant: '',
      },
      () => {
        this.nameInput.current && this.nameInput.current.focus()
      },
    )

  handleOnAddClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    this.props.onSave({
      id: this.state.id,
      name: this.state.participant,
    })
    if (this.state.canAddMore) {
      this.clearForm()
    } else {
      this.props.onCancel()
    }
  }

  render() {
    const { participant } = this.props
    const title = participant ? 'Edit participant' : 'Add a new participant'
    const buttonText = participant ? 'Save' : 'Add'
    return (
      <div className={styles.container}>
        <h2>{title}</h2>
        <form className={styles.form} onSubmit={this.handleOnAddClick}>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            inputRef={this.nameInput}
            autoFocus
            placeholder="ex. Bob"
            value={this.state.participant}
            onChange={this.onInputChange}
            required
          />
          {!this.props.participant && (
            <Checkbox
              checked={this.state.canAddMore}
              onClick={this.toggleAddMore}
              readOnly>
              Add more
            </Checkbox>
          )}
          <div className={styles.buttonContainer}>
            <Button className={styles.button} type="submit" bsStyle="success">
              {buttonText}
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
