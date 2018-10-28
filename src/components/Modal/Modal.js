// @flow
import * as React from 'react'
import { Component } from 'react'
import ReactModal from 'react-modal'
import './Modal.scss'
import cx from 'classnames'
import styles from './Modal.module.scss'

export type ModalPropsT = {
  content: React.Node,
  className?: string,
  onRequestCloseEnabled?: boolean,
}

export type PropsT = {
  isOpen: boolean,
  onRequestClose: () => void,
  data: ?ModalPropsT,
}

export default class Modal extends Component<PropsT, void> {
  render() {
    const { isOpen, data, onRequestClose } = this.props
    ReactModal.setAppElement('body')
    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={data && data.onRequestCloseEnabled && onRequestClose}
        className={cx(styles.modal, data && data.className)}
        overlayClassName={styles.overlay}
        contentLabel="Modal"
      >
        {data && data.content}
      </ReactModal>
    )
  }
}
