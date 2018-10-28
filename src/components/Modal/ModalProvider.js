// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal, { type ModalPropsT } from './Modal'

type PropsT = {
  children: React$Node,
}

type StateT = {
  isOpen: boolean,
}
class ModalProvider extends Component<PropsT, StateT> {
  state = { isOpen: false }
  data: Array<ModalPropsT> = []

  getChildContext() {
    return {
      openModal: this.openModal,
      closeModal: this.close,
    }
  }

  openModal = (data: ModalPropsT) => {
    this.data.push(data)
    this.setState({ isOpen: true })
  }

  close = () => {
    this.data.pop()
    this.setState({ isOpen: !!this.data.length })
  }

  render() {
    const data = this.data[this.data.length - 1]
    return (
      <div>
        <Modal
          isOpen={this.state.isOpen}
          data={data}
          onRequestClose={this.close}
        />
        {this.props.children}
      </div>
    )
  }
}

ModalProvider.childContextTypes = {
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
}

export default ModalProvider
