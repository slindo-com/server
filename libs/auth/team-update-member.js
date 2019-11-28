const { db } = require('../../libs/db.js'),
	{ teamSyncOut } = require('../../libs/auth/team-sync.js')


exports.updateMember = async (ws, sockets, { teamId, id, name }) =>
	new Promise(async (resolve, reject) => {
		console.log('UPDATE MEMBER', teamId, id, name)
		resolve(true)
	})