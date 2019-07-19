import React, {Component} from 'react'
import Service from '../Index-service'
import {Comment, Form, Button, Header, Container} from 'semantic-ui-react'

const service = new Service();
export default class FeedComment extends Component {
	constructor(props){
		super(props)
		this.state = {
			comment: '',
			comments: this.props.comments,
		}
		this.handleChange = this.handleChange.bind(this)
		this.onComment = this.onComment.bind(this)
	}

	handleChange = (event, {value}) => {
		this.setState({comment: value})
	}

	onComment(){
		this.props.onComment(this.state.comment, this.props.meeting_id)
	}

	render(){
		var {comments} = this.state
		return(
			<Container>
                <Comment.Group size='tiny'>
                    <Header size='small' dividing>
                    Comments
                    </Header>

                    {comments.map(comment => {
                        var  time  = comment.time.slice(0, -1).split("T")
                        return (<Comment key={comment.id}>
                        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>{comment.username}</Comment.Author>
                            <Comment.Metadata>
                            <div>{time[0]} at {time[1]}</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.comment}</Comment.Text>
                            <Comment.Actions>
                            <Comment.Action >Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                        </Comment>)
                    }
                    )}
                    
                    <Form reply>
                    <Form.TextArea onChange={this.handleChange}/>
                    <Button content='Add Reply' labelPosition='left' icon='edit' primary size='mini' onClick={this.onComment}/>
                    </Form>
                </Comment.Group>
            </Container>
		);
	}

}