import React, {Component} from 'react'
import Service from '../Index-service'
import {Segment, Portal, Comment, Form, Button, Header, Container} from 'semantic-ui-react'
import RefreshedToken from './rtoken';

const service = new Service();
export default class FeedComment extends Component {
    constructor(props){
        super(props)
        this.state = {
            comment: '',
            comments: this.props.comments,
            open: false,
            userna: {},
            event: {}
        }
        this.handleChange = this.handleChange.bind(this)
        this.onComment = this.onComment.bind(this)
        this.deleteMeet = this.deleteMeet.bind(this)
    }

    handleClose = () => this.setState({ open: false })
    handleOpen = () => this.setState({ open: true })

    handleChange = (event, {value}) => {
        this.setState({comment: value})
    }

    onComment(){
        this.props.onComment(this.state.comment, this.props.meeting_id)
    }

    deleteMeet(){
        RefreshedToken(this.props.access)
        .then(response => {
            service.delMeet(response.data.access, this.props.meeting_id)
            .then(res => {
                console.log(res)
                window.location.reload()
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount(){
        RefreshedToken(this.props.access)
        .then(response => {
            service.userByID(response.data.access)
            .then(response => {
                response.map(res => {
                        let s = res.id
                        let y = { [s] : res.username }
                        this.setState({userna: Object.assign( {}, this.state.userna, y)});
                })})
            })
            .catch(err => {
                console.log(err)
            })
        .catch(err => {
            console.log(err)
        })
    }

    renderbutton(){
        if((this.props.usern.username == this.props.creatern) || this.props.usern.is_staff){
            const { open } = this.state
            return (
                <Container>
                <Form.TextArea onChange={this.handleChange}/>
                    <Button content='Add Reply' labelPosition='left' icon='edit' secondary size='small' onClick={this.onComment}/>

                <Button size='small' secondary name='delete' onClick={this.deleteMeet}>
                    Delete Meet
                </Button>


                <Button
                    content='Meet Detail'
                    size='small'
                    disabled={open}
                    secondary
                    onClick={this.handleOpen}
                />

                <Portal onClose={this.handleClose} open={open}>
                <Segment
                        style={{
                        left: '40%',
                        position: 'fixed',
                        top: '30%',
                        zIndex: 1000,
                    }}
                >
                    <Header>Participants</Header>
                    <p>{this.props.participants
                                    .map(invited =>
                                        <div> {this.state.userna[invited]} </div>
                                    )}</p>
                    <Button
                        content='Close'
                        negative
                        onClick={this.handleClose}
                    />

                    </Segment>
                </Portal>
                </Container>
            );
        } else {
            const { open } = this.state
            return (
            <Container>
                <Form.TextArea onChange={this.handleChange}/>
                    <Button 
                        content='Add Reply' 
                        labelPosition='left' 
                        icon='edit' 
                        secondary 
                        size='small' 
                        onClick={this.onComment}
                    />  


                <Button
                    content='Meet Detail'
                    size='small'
                    disabled={open}
                    secondary
                    onClick={this.handleOpen}
                />

                <Portal onClose={this.handleClose} open={open}>
                <Segment
                        style={{
                        left: '40%',
                        position: 'fixed',
                        top: '30%',
                        zIndex: 1000,
                    }}
                >
                    <Header>Participants</Header>
                    <p>{this.props.participants
                            .map(invited =>
                                <div> {this.state.userna[invited]} </div>
                            )}</p>
                    <Button
                        content='Close'
                        negative
                        onClick={this.handleClose}
                    />
                    </Segment>
                </Portal>
            </Container>
            );
        }
    }


    render(){
        return(
            <Container>
                <Comment.Group size='tiny'>
                    <Header dividing>
                        Comments
                    </Header>

                    {this.state.comments.map(comment => {
                        return (
                        <Comment key={comment.id}>
                        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' />
                        <Comment.Content>
                            <Comment.Author>{comment.username}</Comment.Author>
                            <Comment.Metadata>
                                <div>{comment.time.slice(8,10)}-{comment.time.slice(5,7)}-{comment.time.slice(0,4)}  at {comment.time.slice(11, 19)}</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.comment}</Comment.Text>
                        </Comment.Content>
                        </Comment>
                        )
                    }
                    )}
                    
                    <Form reply>
                        {this.renderbutton()}
                    </Form>
                </Comment.Group>
            </Container>
        );
    }

}