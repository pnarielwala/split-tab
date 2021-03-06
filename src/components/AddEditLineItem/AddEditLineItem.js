// @flow
import React, { Component } from 'react'
import {
  FormControl,
  Button,
  InputGroup,
  ControlLabel,
  Alert,
} from 'react-bootstrap'
import styles from './AddEditLineItem.module.scss'

type ParticipantT = {
  id: string,
  name: string,
}

type LineItemT = {
  id: string,
  participants: Array<string>,
  amount: number,
  label: string,
}

type PropsT = {
  lineItem?: LineItemT,
  participants: Array<ParticipantT>,
  totalLineItems: number,
  onAdd: LineItemT => void,
  onCancel: () => void,
}

type StateT = {
  id: string,
  selectedParticipants: Array<string>,
  amount: string,
  description: string,
  error: string,
}

class AddLineItem extends Component<PropsT, StateT> {
  constructor(props: PropsT) {
    super(props)

    this.state = {
      id: props.lineItem ? props.lineItem.id : this.createUUID(),
      selectedParticipants: props.lineItem ? props.lineItem.participants : [],
      amount: props.lineItem ? `${props.lineItem.amount}` : '',
      description: props.lineItem ? props.lineItem.label : '',
      error: '',
    }
  }

  onAmountChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (/^\d*[.]?\d{0,2}$/.test(value))
      this.setState({ amount: value, error: '' })
  }

  onDescriptionChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const value = event.target.value
    this.setState({ description: value })
  }

  createUUID = () =>
    Math.random()
      .toString(36)
      .substring(2)

  handleOnAddClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (this.state.selectedParticipants.length) {
      const label =
        this.state.description || `Line ${this.props.totalLineItems + 1}`
      this.props.onAdd({
        id: this.state.id,
        label,
        amount: parseFloat(this.state.amount),
        participants: this.state.selectedParticipants,
      })
    } else {
      this.setState({ error: 'Please select a participant' })
    }
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
      error: '',
    })
  }

  render() {
    const { participants, lineItem } = this.props
    const isMobile = window.innerWidth < 640
    const title = lineItem ? 'Edit line item' : 'Add a new line item'
    const buttonText = lineItem ? 'Save' : 'Add'
    return (
      <div className={styles.container}>
        <h2>{title}</h2>
        <form className={styles.form} onSubmit={this.handleOnAddClick}>
          <div className={styles.inputContainer}>
            <ControlLabel>Amount</ControlLabel>
            <InputGroup className={styles.input}>
              <InputGroup.Addon>$</InputGroup.Addon>
              <FormControl
                autoFocus
                type={isMobile ? 'number' : 'text'}
                min={0}
                step=".01"
                placeholder="ex. 10.99"
                value={this.state.amount}
                onChange={this.onAmountChange}
                required
              />
            </InputGroup>
          </div>
          <div className={styles.inputContainer}>
            <ControlLabel>Description (optional)</ControlLabel>
            <FormControl
              className={styles.input}
              placeholder="ex. Enchiladas Verde"
              value={this.state.description}
              onChange={this.onDescriptionChange}
            />
          </div>
          <div className={styles.participantsContainer}>
            <ControlLabel>Participants</ControlLabel>
            <div className={styles.participantsButtonContainer}>
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
          </div>
          <div className={styles.footer}>
            {this.state.error && (
              <Alert bsStyle="danger" className={styles.error}>
                {this.state.error}
              </Alert>
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
          </div>
        </form>
      </div>
    )
  }
}

export default AddLineItem
