class NotValidActivateLink extends Error {
    constructor(message) {
        super(message);
        this.name = 'Is not valid activate link';
    }
};

module.exports = NotValidActivateLink;