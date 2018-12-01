import React, { Component } from 'react';
import Rebase from 're-base';
import { ToastConsumer, ToastProvider } from 'react-toast-notifications';

import firebase from '../lib/firebase';
import App from '../components/app';

const base = Rebase.createClass(firebase.database());

export default class Index extends Component {
  state = {
    attendees: [],
  }

  componentDidMount() {
    base.bindToState('/', {
      context: this,
      state: 'attendees',
      asArray: true,
      then() {
        this.setState(() => ({ loading: false }));
      }
    });
  }

  update(id, data) {
    base.update(`/${id}`, {
      data,
    }).then(() => {
      //this._addToast(`${this.state.attendees[id].firstname} checked in`, {
      //  appearance: 'success',
      //  autoDismiss: true,
      //});
      this.setState(() => ({ loading: false }));
    }).catch((error) => {
      //this._addToast(`Error: ${error.message || error.toString()}`, {
      //  appearance: 'error',
      //  autoDismiss: true,
      //});
    });
  }

  render() {
    return (
      <ToastProvider>
        <ToastConsumer>
          {({ add }) => {
            this._addToast = add;
            return (
              <App
                attendees={this.state.attendees}
                loading={this.state.loading}
                update={this.update}
              />
            );
          }}
        </ToastConsumer>
      </ToastProvider>
    );
  }
}
