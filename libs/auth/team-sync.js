const { db } = require('../../libs/db.js')


exports.teamSyncOut = async (ws, teamId) => {

	console.log('TEAM', teamId)

	const team = await db.get({
		collection: 'teams',
		id: teamId
	}).catch(err => {
		console.log('ERR', err)
	})

	if(!team) {

		const newObj = await db.create({
			collection: 'teams',
			id: teamId,
			object: {
				id: teamId,
				title: '',
				users: [{
					id: ws.userData.id,
					role: 'ADMIN'
				}],
				invitations: []
			}
		}).catch(err => {
			console.log(err)
		})

		ws.send(
			JSON.stringify({
				action: 'updateTeams',
				team: {
					id: teamId,
					title: '',
					users: [{
						id: ws.userData.id,
						role: 'ADMIN'
					}],
					invitations: []
				}
			})
		)
		return
	} else {
		delete team._id
		ws.send(
			JSON.stringify({
				action: 'updateTeams',
				team
			})
		)
	}

}