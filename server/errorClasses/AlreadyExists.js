class AlreadyExists extends Error {
    constructor(message) {
        super(message);
        this.name = 'AlreadyExists';
    }
};

module.exports = AlreadyExists;