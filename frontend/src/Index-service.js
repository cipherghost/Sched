import axios from 'axios'

export default class Service{
	constructor(){}

	createUser(user){
		var { first_name, is_staff, email, password, username } = user
		const url = `http://localhost:8000/api/users/`;
		return axios.post(url, {
            'first_name': first_name,
            'username': username,
            'email': email,
            'is_staff': is_staff,
            'password': password,
        })
        .then(response => response.data);
	}

	listUser(access){
		const url = `http://localhost:8000/api/users/`
		return axios.get(url, {
			headers: {
				'Authorization': 'Bearer' + " " + access
			}
		})
		.then(response => response.data);	
	}

	getMeet(access){
		const url = `http://localhost:8000/api/meetings/`;
		return axios.get(url, {
			headers: {
				'Authorization': 'Bearer ' + access
			}
		})
		.then(response => response.data);
	} 

	delMeet(access, meeting_id){
		const url= `http://localhost:8000/api/meetings/${meeting_id}`;
		return axios.get(url, {
			headers: {
				'Authorization': 'Bearer ' + access
			}
		})
		.then(response => response.data);
	}

	createMeet(meeting, access){
		var { purpose, venue, participants, meeting_on } = meeting
		const url =`http://localhost:8000/api/meetings/`;
		return axios.post(url, 
			{
				'purpose': purpose,
				'meeting_on': meeting_on,
				'venue': venue,
				'participants': participants,
			},
			{headers: {
					'Authorization': 'Bearer' + " " + access
				}
			}
		)
		.then(response => response.data);
	}

	updateMeet(access, meeting){
		const url = `http://localhost:8000/api/meetings/${meeting.meeting_id}`;
		return axios.get(url, {
			headers: {
				'Authorization': 'Bearer ' + access
			}
		})
		.then(response => response.data);
	}

	//detailMeet()
}