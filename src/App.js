// @flow
import React, { Component } from 'react'
import { ModalProvider, ModalConsumer } from 'components/Modal'
import Tab from './Tab'

class App extends Component<void, void> {
  render() {
    return (
      <ModalProvider>
        <div className="App">
          <ModalConsumer>
            {({ openModal, closeModal }) => (
              <Tab
                {...{
                  openModal,
                  closeModal,
                }}
              />
            )}
          </ModalConsumer>
        </div>
      </ModalProvider>
    )
  }
}

export default App
