const {MongoClient} = require('mongodb');

const client = new MongoClient('mongodb+srv://nuzakov:FghRtecv!23@cluster0.3a3uq.mongodb.net/chat?retryWrites=true&w=majority', { useUnifiedTopology: true });

const start = async () => {
    try {
        await client.connect()
        console.log('connected')
    } catch(err) {
        console.log(err);
    }
};

module.exports.start = start;