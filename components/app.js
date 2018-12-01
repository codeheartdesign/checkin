import React, { Component } from 'react';
import Fuse from 'fuse.js';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
`

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
`;

const Search = styled.input`
  border: 1px solid gray;
  border-radius: 3px;
  padding: 1em;
  flex-grow: 1;
`;

const AddButton = styled.button`

`;

const Button = styled.button`
  border: 1px solid gray;
  border-radius: 3px;
  font-size: 1.2em;
  padding: 0.5em;
  &:hover {
    cursor: pointer;
  }
`;

const Expanded = styled.div`
  background-color: lightgrey;
  padding: 1em;
  border: 1px solid gray;
  border-top: none;
`;

const Name = styled.div`
  padding: 1em;
  color: white;
  background-color: #1a2441;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
`;

const CheckedIn = styled.span`
  padding-left: 2em;
  color: rgba(255, 255, 255, 0.8);
`;

const Li = styled.li`
  list-style: none;
`;

const Info = styled.div`
  padding: 0.5em;
`;

export default class App extends Component {
  state = {
    fuse: undefined,
    searchText: '',
    attendees: [],
  }

  search = ({target: {value}}) => {
    if (value && value.length) {
      const foundAttendees = this.state.fuse.search(value);
      this.setState({
        attendees: foundAttendees,
        searchText: value,
      });
    } else {
      this.setState({
        searchText: '',
        attendees: this.state.allAttendees,
      });
    }
  }

  showConfirm = (key) => {
    const attendee = this.props.attendees.filter(attendee => attendee.key === key)[0];
    if (attendee.arrived) {
      return;
    }
    // Hack!
    attendee.showConfirm = true;
    this.forceUpdate();
  }

  cancelConfirm = (key) => {
    // Hack!
    this.props.attendees.filter(attendee => attendee.key === key)[0].showConfirm = false;
    this.forceUpdate();
  }

  componentWillReceiveProps({attendees = []}) {

    const attendeesCollection = Object.keys(attendees)
      .map(key => Object.assign({key}, attendees[key]));

    this.setState({
      fuse: new Fuse(attendeesCollection, {
        shouldSort: true,
        tokenize: true,
        distance: 3,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'firstname',
          'lastname',
          'ticket',
        ]
      }),
      attendees: attendeesCollection,
      allAttendees: attendeesCollection,
      searchText: '',
    });
  }

  expand = (id) => {
    this.setState(() => ({ expandedId: id }));
  }

  collapse = () => {
    this.setState(() => ({ expandedId: null }));
  }

  render() {
    return (
      <div className="App">
        <GlobalStyle />
        <h1>Code Heart Design</h1>
        <TopBar>
           <Search type='text' onChange={this.search} placeholder='Enter name' value={this.state.searchText} />
           <AddButton>Add</AddButton>
        </TopBar>
        <ul>
          {this.state.attendees.map((attendee) => {
            return (
              <Li key={attendee.id}>
                <Name onClick={() => this.state.expandedId === attendee.id ? this.collapse() : this.expand(attendee.id)}>
                  {attendee.firstname} {attendee.lastname}
                  {attendee.arrived ? <CheckedIn>(checked in)</CheckedIn> : null}
                </Name>
                {this.state.expandedId === attendee.id ? (
                  <Expanded>
                    <Info>Tshirt: {attendee.shirt}</Info>
                    <Info>Dietary: {attendee.diet}</Info>
                    <Info>Ticket: {attendee.ticket}</Info>
                    <Button className='button' onClick={() => this.props.update(attendee.id, { arrived: true })} disabled={attendee.arrived}>
                      Check in
                    </Button>
                  </Expanded>
                ) : null}
              </Li>
            );
          })}
        </ul>
      </div>
    );
  }
}
