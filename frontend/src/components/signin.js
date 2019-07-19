import React, { Component } from 'react'
import { Menu, Segment, Container, Form, Message, List, Button, Divider } from 'semantic-ui-react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Signin extends Component {

	constructor(props){
        super(props)
        this.state = {
            redirect: false,
            user: {},
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    handleSubmit(e){

        Axios.post("http://localhost:8000/api/token/", {
            username: this.state.user.username,
            password: this.state.user.password,
        })
        .then(response => {
            console.log(response, "fine")
            var user = {}
            user['refresh'] = response.data.refresh
            Axios.get(`http://localhost:8000/api/users/${this.state.user.username}`, {
                headers: {
                    "Authorization": "Bearer " + response.data.access
                }
            })
            .then(response => {
                user = {...response.data, ...user}
                this.setState({redirect: !this.state.redirect, user: user})
            })
            .catch(error => {
                alert("Wrong credentials!!")
                console.error("Wrong credentials!!!", error)
            })
        })
        .catch(error => {
            console.error(error)
            alert("Wrong credentials!!")
        })
        
    }


    handleChange(e, { name, value }){
        this.setState(state => {
            state.user[name]= value
            return state
        })
    }
    

    shouldRedirect(){
        var { redirect, user } = this.state
        if(redirect === true)
            return <Redirect to={{
                       pathname: "/home",
                       state: user,
                   }} />
     }              

	render(){
		return(
			<Container>
			{this.shouldRedirect()}
            <Menu>
                <Menu.Menu position='right'>
                    <Button secondary icon='signup' content='SIGN UP' href='/signup' />
                    <Button secondary icon='sign-in' content='SIGN IN' href='/' />
                </Menu.Menu>
            </Menu>  
            <Container relaxed='very' stackable>
            	<Segment placeholder>
            		<Form onSubmit={this.handleSubmit}>
	                	<Form.Input name='username' icon='user' iconPosition='left' label='Username' placeholder='Username' onChange={this.handleChange}/>
    	            	<Form.Input name='password' icon='lock' iconPosition='left' label='Password' placeholder='Password' type='password' onChange={this.handleChange}/>

                		<Button secondary content='Login' type='submit'/>
            		</Form>
            	</Segment>
            </Container>
            </Container>

		)
	}
}