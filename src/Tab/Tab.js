// @flow
import React, { Component } from 'react'
import type { ModalPropsT } from 'components/Modal'
import AddParticipant from 'components/AddParticipant'
import AmountPerParticipant from 'components/AmountPerParticipant'
import AmountPerLineItem from 'components/AmountPerLineItem'
import AmountPerCategory from 'components/AmountPerCategory'
import AddEditLineItem from 'components/AddEditLineItem'
import TipSelect from 'components/Tip'
import {
  Button,
  PageHeader,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
  Well,
  Tab,
  Tabs,
} from 'react-bootstrap'
import styles from './Tab.module.scss'

type ParticipantT = {
  id: string,
  name: string,
}

type LineItemT = {
  id: string,
  label: string,
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
  selectedTab: string,
}

class Bill extends Component<PropsT, StateT> {
  state = {
    participants: {},
    lineItems: {},
    tipPercent: 0,
    tax: '',
    selectedTab: 'participant',
  }

  handleAddParticipantClick = () => {
    this.props.openModal({
      content: (
        <AddParticipant
          onSave={this.onAddParticipant}
          onCancel={this.props.closeModal}
        />
      ),
      onRequestCloseEnabled: true,
    })
  }

  onAddParticipant = (participant: ParticipantT) => {
    this.setState({
      participants: {
        ...this.state.participants,
        [participant.id]: participant,
      },
    })
  }

  handleAddLineItemClick = () => {
    const totalLineItems = Object.keys(this.state.lineItems).length
    this.props.openModal({
      content: (
        <AddEditLineItem
          participants={Object.values(this.state.participants)}
          totalLineItems={totalLineItems}
          onAdd={this.onAddLineItem}
          onCancel={this.props.closeModal}
        />
      ),
      onRequestCloseEnabled: true,
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

  handleEditLineItemClick = (id: string) => {
    const totalLineItems = Object.keys(this.state.lineItems).length
    this.props.openModal({
      content: (
        <AddEditLineItem
          lineItem={this.state.lineItems[id]}
          participants={Object.values(this.state.participants)}
          totalLineItems={totalLineItems}
          onAdd={this.onAddLineItem}
          onCancel={this.props.closeModal}
        />
      ),
      onRequestCloseEnabled: true,
    })
  }

  handleEditParticipantClick = (id: string) => {
    this.props.openModal({
      content: (
        <AddParticipant
          participant={this.state.participants[id]}
          onSave={this.onAddParticipant}
          onCancel={this.props.closeModal}
        />
      ),
      onRequestCloseEnabled: true,
    })
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
        const amount = lineItem.amount
        const tipAmount = amount * this.state.tipPercent
        const taxAmount = amount * (tax / billBaseTotal)
        const total = amount + tipAmount + taxAmount
        acc.subtotal += amount
        acc.tip += tipAmount
        acc.total += total

        const totalPerParticipant = total / numOfParticipants
        // for each line item, increment basetotal for each participant
        lineItem.participants.forEach(participantId => {
          // for each participant (init if needed) add baseTotal from line item amount
          const myTotal = acc.participantTotals[participantId] || 0
          acc.participantTotals[participantId] = myTotal + totalPerParticipant
        })
        acc.lineItemTotals.push({
          id: lineItem.id,
          label: lineItem.label,
          amount: total,
        })
        return acc
      },
      {
        participantTotals: initParticipantTotals,
        lineItemTotals: [],
        subtotal: 0,
        tip: 0,
        tax,
        total: 0,
      },
    )

    return bill
  }

  handleTabChange = (eventKey: string) => {
    this.setState({ selectedTab: eventKey })
  }

  render() {
    const {
      participantTotals,
      lineItemTotals,
      total,
      tax,
      tip,
      subtotal,
    } = this.getTotals()
    const isMobile = window.innerWidth < 640
    return (
      <div className={styles.container}>
        <PageHeader>Split Tab</PageHeader>
        <Button
          className={styles.button}
          onClick={this.handleAddParticipantClick}>
          Add participant
        </Button>
        <Button className={styles.button} onClick={this.handleAddLineItemClick}>
          Add line item
        </Button>
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
              step=".01"
              min={0}
              placeholder="ex. 10.50"
              onChange={this.onTaxInputChange}
            />
          </InputGroup>
        </FormGroup>
        <div className={styles.breakdown}>
          <ControlLabel>Breakdown by</ControlLabel>
          <Tabs
            defaultActiveKey={1}
            animation={false}
            id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Participants">
              <Well className={styles.well}>
                <AmountPerParticipant
                  onEditClick={this.handleEditParticipantClick}
                  participants={this.state.participants}
                  totalsPerParticipant={participantTotals}
                />
              </Well>
            </Tab>
            <Tab eventKey={2} title="Line items">
              <Well className={styles.well}>
                <AmountPerLineItem
                  onEditClick={this.handleEditLineItemClick}
                  lineItems={lineItemTotals}
                />
              </Well>
            </Tab>
            <Tab eventKey={3} title="Totals">
              <Well className={styles.well}>
                <AmountPerCategory
                  subtotal={subtotal}
                  tip={tip}
                  tax={tax}
                  total={total}
                />
              </Well>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default Bill
