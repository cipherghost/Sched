import React, {Component} from 'react'
import Service from '../Index-service'
import { Segment, Feed, Accordion, Tab, Item, Container, Button } from 'semantic-ui-react';
import RefreshedToken from './rtoken'
import FeedComment from './meetComment' 
import Axios from 'axios';

const service = new Service()

export default class MeetList extends Component {
	constructor(props){
		super(props)
		this.state = {
			meetings : [],
			comments : {},
			websocket: {},
			activeIndex: -1,
			access: '',
		}
		this.handleClick = this.handleClick.bind(this);
        this.handleComment = this.handleComment.bind(this);
	}

	async componentDidMount(){
		var {user} = this.props
		Axios.get(`http://localhost:8000/api/comments/`)
		.then(response => {
			var comments = {}
			response.data.map(comment => {
				if(comments[comment.meet] == undefined)
					comments[comment.meet] = []
				comments[comment.meet].push(comment)
			})
			this.setState({comments: comments})
			console.log(response)
		})
		.catch(err => {
			console.log(err)
		})
		
		this.setState({access: user.refresh})

		RefreshedToken(user.refresh)
		.then(response => {
			service.getMeet(response.data.access)
			.then(response => {
				this.setState({meetings: response})
			})
			.catch(err => console.log(err))
		})
		.catch(err => console.log(err))

		var websocket = new WebSocket("ws://localhost:8000/ws/comment/")

		websocket.onmessage = (event) => {
			var comment = JSON.parse(event.data).comment
			var {comments} = this.state
			if(comments[comment.meet] === undefined)
				comments[comment.meet] = []
			comments[comment.meet].push(comment)
			this.setState({comments: comments})
		}
		websocket.onopen = (event) => {console.log('websocket onopen')}
		websocket.onerr = (event) => {console.log('websocket onerr')}
		this.setState({websocket: websocket})
	}


	handleClick(e, id){
        const { index } = id
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })         
    }

    handleComment(text, meeting_id){
		var comment = {
			'meet': meeting_id,
			'comment': text,
			'user': this.props.user.id
		}
		service.addComment(comment)
		.then(data => {
			var { websocket } = this.state
			websocket.send(JSON.stringify(data))
		})
		.catch(err => {console.log(err)})
	}

	renderbutton(created_by, created_on, venue){
		if(this.props.user.username==created_by){
			return (
				<Feed.Extra text>
				 	{"You created a meeting to be held at "+ venue + " on " + created_on.slice(8, 10)+ '/' + created_on.slice(5,7)  + " at " + created_on.slice(11, 16)+ "."}
				 </Feed.Extra>
      		);
    	} else {
      		return (
      			<Feed.Extra text>
        	   		{created_by.toUpperCase() + " has invited you for a meeting at " + venue  + " on " + created_on.slice(8, 10)+ '/' + created_on.slice(5,7) + " at " + created_on.slice(11, 16)+ "."}
        	   	</Feed.Extra>
      		);
    	}
	}

	render(){                        
		var AccordionItem = (meeting) => {
				var { meeting_id } = meeting
                var { activeIndex, comments, user} = this.state
                if(comments[meeting_id] == undefined)
                    comments[meeting_id] = []
                return (
                    <Item key={meeting_id}>
                    <Accordion.Title active={activeIndex === meeting_id} index={meeting_id} onClick={this.handleClick}>
                        <Segment>
							<Feed size='small'>
								<Feed.Event>
                                    <Feed.Label image={'https://react.semantic-ui.com/images/avatar/small/matt.jpg'} />
                                    <Feed.Content>
                                        <Feed.Date content={meeting.created_on.slice(8,10) + "/" + meeting.created_on.slice(5,7) + "/" + meeting.created_on.slice(0, 4) + " at " + meeting.created_on.slice(11, 16)} />
                                        <Feed.Summary content={meeting.purpose.toUpperCase()} />

                                        <Feed.Extra text>
                                           	{this.renderbutton(meeting.created_by, meeting.meeting_on, meeting.venue)}
                                        </Feed.Extra>
                                    </Feed.Content>
                                </Feed.Event>
                            </Feed>
                        </Segment>
                            </Accordion.Title>
                                <Accordion.Content active={activeIndex === meeting_id}>
                                    <FeedComment comments={comments[meeting_id]} onComment={this.handleComment} purpose={meeting.purpose} meeting_on={meeting.meeting_on} participants={meeting.participants} meeting_id={meeting_id} access={this.state.access} usern={this.props.user} creatern={meeting.created_by}/>
                                </Accordion.Content>
                    </Item>
            )}

		return(
		<Container>
			<Accordion fluid styled>
				{this.state.meetings
					.map(meeting => AccordionItem(meeting))}
			</Accordion>
		</Container>	
		);						
	}

}