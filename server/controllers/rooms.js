// const Rooms = require('../db/models/Rooms');
// const User = require('../db/models/User');

module.exports.rooms = async function (req, res) {
    // const {userId} = req.body;
    // try {
    //     const rooms = await Rooms.find({ members: userId});
    //     const users = await User.find();
    //     const dialogs = rooms.map(room => {
    //         const interlocutorId = room.members.filter(id => String(id) !== String(userId))[0];
    //         const interlocutorName = users.find(({_id}) => String(_id) === String(interlocutorId)).name;
    //         return {roomId: room._id, interlocutorName, interlocutorId};
    //     });
    //     res.status(200).json({
    //         message: 'get rooms success',
    //         dialogs,
    //     })
    // } catch (err) {
    //     console.log(`this error in rooms controller, error: ${err}`);
    //     res.status(500).json({
    //         message: 'get rooms failed'
    //     });
    // }
};
