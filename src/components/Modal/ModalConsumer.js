// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import { type ModalPropsT } from './Modal'

type ContextT = {
  openModal: (data: ModalPropsT) => void,
  closeModal: () => void,
}

type PropsT = {
  children: (modalContext: ContextT) => React.Node,
}

const ModalConsumer = (props: PropsT, context: ContextT) => {
  return (
    props.children &&
    props.children({
      openModal: context.openModal,
      closeModal: context.closeModal,
    })
  )
}

ModalConsumer.contextTypes = {
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
}

export default ModalConsumer
