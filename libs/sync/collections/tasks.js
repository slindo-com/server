const jwt = require('jsonwebtoken')
const { db } = require('../../../libs/db.js')

const STANDARD_ATTRIBUTES = [
	'id',
	'createdAt',
	'updatedAt',
	'__deleted',
	'__updates',
	'__sync'
]


const ATTRIBUTES = [
	'number',
	'title',
	'description',
	'project',
	'status',
	'responsible',
	'labels',
	'priority',
	'due',
	'user',
	'team'
]
exports.ATTRIBUTES = ATTRIBUTES



const DB_SEARCH = {
	team: '$TEAM'
}
exports.DB_SEARCH = DB_SEARCH


exports.shouldBeSynced = async (obj, user) =>
	new Promise(async (resolve, reject) => {

		if(Object.keys(obj).length != (ATTRIBUTES.length + STANDARD_ATTRIBUTES.length)) {
			console.log(Object.keys(obj).length, (ATTRIBUTES.length + STANDARD_ATTRIBUTES.length))
			resolve(false)
		}

		ATTRIBUTES.forEach(attr => {
			if(!obj.hasOwnProperty(attr)) {
				resolve(false)
			}
		})

		STANDARD_ATTRIBUTES.forEach(attr => {
			if(!obj.hasOwnProperty(attr)) {
				resolve(false)
			}
		})

		if(obj.user != user.id) {
			resolve(false)
		}
				
		if(!user.teams[obj.team]) {
			resolve(false)
		}

		// TODO: Maybe control type of every attribute?

		resolve(true)
	})

exports.shouldBeSyncedOut = (ws, socketsTeams, newObj) => {
	if(socketsTeams[newObj.team]) {
		return (socketsTeams[newObj.team]).filter(client =>
			client.clientId != ws.clientId 
			|| newObj.updatedAt.toString() === newObj.__updates.number.toString()
		)
	}

	return []
}


exports.adjustDataIn = async (obj, user) =>
	new Promise(async (resolve, reject) => {

		if(obj.number === null) {
			let lastNumberObj = await db.find({
				collection: 'tasks',
				object: {
					team: obj.team
				},
				limit: 1,
				sort: {
					'number': -1
				}
			}).catch(err => {
				reject({
					code: 'user-not-found'
				})
			})

			if(!lastNumberObj || !lastNumberObj[0] || lastNumberObj[0].number === null) {
				obj.number = 1
			} else {
				obj.number = lastNumberObj[0].number + 1
			}

			const updateDate =  new Date()
			obj.updatedAt = updateDate
			obj.__updates.number = updateDate
		}

		resolve(obj)
	})