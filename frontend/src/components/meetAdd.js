import React, {Component} from 'react';
import { Message, Form, Button, Dropdown, Container, Segment } from 'semantic-ui-react';
import RefreshedToken from './rtoken';
import Service from '../Index-service';

var service = new Service();

export default class MeetAdd extends Component{
	constructor(props){
		super(props);
		this.state = {
			date: '',
			time: '',
			purpose: '',
			meeting_on: '',
			venue: '',
			soptions: [],
			participants: [],
			error: false,
			success: false
		}
		this.handleChange = this.handleChange.bind(this)
		this.adropdown = this.adropdown.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	adropdown(event, {value}){
		this.setState({participants: value})
	}

	handleSubmit(event){
		var data = {}
		var {meeting_on, purpose, date, time, venue, participants} = this.state
		data['meeting_on'] = date + "T" + time + "Z"
		data['purpose'] = purpose
		data['venue'] = venue
		data['created_by'] = this.props.user.id
		data['participants'] = participants
		RefreshedToken(this.props.user.refresh)
		.then(response => {
            service.createMeet(data, response.data.access)
            .then(response => {
                console.log(response.data)
                this.setState({error: false, success: true})
            })
            .catch(error => {
                console.log(error.status)
                this.setState({error: true, success: false})
            })
        })
	}

	handleChange = (event, {name, value}) => {
    	this.setState({ [name]: value });
  	}
	
	updateUsers(){
        RefreshedToken(this.props.user.refresh)
        .then(response => {
            service.listUser(response.data.access)
            .then(response => {
            	console.log(response)
                this.setState({soptions: response.map(user => {return {key: user.id, value: user.id, text: user.username}})})
            })
            .catch(error => {
            	console.log(response)
            })
        })
        
    }

    componentDidMount(){
        this.updateUsers();
    }

	render(){
		var {error, success} = this.state
		return(
			<Container>
			<Form onSubmit={this.handleSubmit} error={error} success={success}>
				<Form.Input 
					required 
					label="Purpose" 
					name="purpose" 
					onChange={this.handleChange} 
				/>
				<Form.Input 
					required 
					label="Venue" 
					name="venue" 
					onChange={this.handleChange} 
				/>
        		<Form.Input label='Time' placeholder='HH:MM:SS' name='time' onChange={this.handleChange}/>
        		<Form.Input label='Date' placeholder='YYYY-DD-MM' name='date' onChange={this.handleChange}/>
        		<Dropdown 
        			multiple
        			search
        			selection
        			placeholder='participants'
        			fluid
        			upward={false}
        			options={this.state.soptions}
        			onChange={this.adropdown}
        		/><br />
        			<Message success header="Success!" />
        			<Message error header="Failed!" content="Please login to continue" />
        		<Button type="submit" secondary>Create Meet</Button>
        	</Form>	
        	</Container>
		);
	}
}