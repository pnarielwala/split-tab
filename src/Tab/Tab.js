// @flow
import React, { Component } from 'react'
import type { ModalPropsT } from 'components/Modal'
import AddParticipant from 'components/AddParticipant'
import AmountPerParticipant from 'components/AmountPerParticipant'
import AddLineItem from 'components/AddLineItem'
import TipSelect from 'components/Tip'
import {
  Button,
  PageHeader,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
} from 'react-bootstrap'
import styles from './Tab.module.scss'

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
  openModal: (data: ModalPropsT) => void,
  closeModal: () => void,
}

type StateT = {
  participants: { [id: string]: ParticipantT },
  lineItems: { [id: string]: LineItemT },
  tipPercent: number,
  tax: string,
}

class Tab extends Component<PropsT, StateT> {
  state = {
    participants: {},
    lineItems: {},
    tipPercent: 0,
    tax: '',
  }

  handleAddParticipantClick = () => {
    this.props.openModal({
      content: (
        <AddParticipant
          onAdd={this.onAddParticipant}
          onCancel={this.props.closeModal}
        />
      ),
    })
  }

  onAddParticipant = (participant: ParticipantT) => {
    this.setState(
      {
        participants: {
          ...this.state.participants,
          [participant.id]: participant,
        },
      },
      this.props.closeModal,
    )
  }

  handleAddLineItemClick = () => {
    this.props.openModal({
      content: (
        <AddLineItem
          participants={Object.values(this.state.participants)}
          onAdd={this.onAddLineItem}
          onCancel={this.props.closeModal}
        />
      ),
    })
  }

  onAddLineItem = (lineItem: LineItemT) => {
    this.setState(
      {
        lineItems: { ...this.state.lineItems, [lineItem.id]: lineItem },
      },
      () => {
        this.props.closeModal()
      },
    )
  }

  handleSelectTip = (tipPercent: number) => {
    this.setState({
      tipPercent: tipPercent === this.state.tipPercent ? 0 : tipPercent,
    })
  }

  onTaxInputChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const value = event.target.value
    const valid = /^\d*[.]?\d{0,2}$/.test(value)
    const tax = valid ? value : this.state.tax
    this.setState({ tax })
  }

  getTotals = () => {
    const participantIds = Object.keys(this.state.participants)
    const initParticipantTotals = participantIds.reduce((acc, id) => {
      acc[id] = 0
      return acc
    }, {})
    const lineItems = Object.values(this.state.lineItems)
    const billBaseTotal = lineItems.reduce(
      (acc, lineItem) => acc + lineItem.amount,
      0,
    )
    const tax = parseFloat(this.state.tax || 0)
    const bill = lineItems.reduce(
      (acc, lineItem) => {
        const numOfParticipants = lineItem.participants.length
        const amount = lineItem.amount / numOfParticipants
        const tipAmount = amount * this.state.tipPercent
        const taxAmount = amount * (tax / billBaseTotal)
        const total = amount + tipAmount + taxAmount
        acc.total += total

        const totalPerParticipant = total / numOfParticipants
        // for each line item, increment basetotal for each participant
        lineItem.participants.forEach(participantId => {
          // for each participant (init if needed) add baseTotal from line item amount
          const myTotal = acc.participantTotals[participantId] || 0
          acc.participantTotals[participantId] = myTotal + totalPerParticipant
        })

        return acc
      },
      {
        participantTotals: initParticipantTotals,
        total: 0,
      },
    )

    return bill
  }

  render() {
    const { participantTotals } = this.getTotals()
    const isMobile = window.innerWidth < 640
    return (
      <div className={styles.container}>
        <PageHeader>Split Tab App</PageHeader>
        <Button
          className={styles.button}
          onClick={this.handleAddParticipantClick}>
          Add participant
        </Button>
        <Button className={styles.button} onClick={this.handleAddLineItemClick}>
          Add line item
        </Button>
        {/* <div>
          <Button bsStyle="link">View line items</Button>
          <Button bsStyle="link">View participants</Button>
        </div> */}
        <TipSelect
          tipPercent={this.state.tipPercent}
          onSelectTip={this.handleSelectTip}
        />
        <FormGroup className={styles.taxContainer}>
          <ControlLabel>Total tax</ControlLabel>
          <InputGroup>
            <InputGroup.Addon>$</InputGroup.Addon>
            <FormControl
              value={this.state.tax}
              type={isMobile ? 'number' : 'text'}
              min={0}
              placeholder="ex. 10.50"
              onChange={this.onTaxInputChange}
            />
          </InputGroup>
        </FormGroup>
        <AmountPerParticipant
          participants={this.state.participants}
          totalsPerParticipant={participantTotals}
        />
      </div>
    )
  }
}

export default Tab
