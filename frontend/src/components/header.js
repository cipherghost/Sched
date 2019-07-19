import React, { Component } from 'react'
import { Menu, Input, Button } from 'semantic-ui-react'

export default class Header extends Component {
  constructor(props){
    super(props);
  }

  
  render() {
    const { activeItem } = this.props
    return (
        <Menu pointing secondary>
            <Menu.Item icon='home' name='home' active={activeItem === 'home'} onClick={this.props.onClick} />
            <Menu.Item icon='plus' name='create' active={activeItem === 'create'} onClick={this.props.onClick} />
            <Menu.Menu position='right'>
              <Menu.Item icon='log out' name='logout' active={activeItem === 'logout'} onClick={this.props.onClick} />
            </Menu.Menu>
        </Menu>
    )
  }
}