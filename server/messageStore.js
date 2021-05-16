const messageStore = {
    messages: {},
    findMessagesForUser(userID) {
        return this.messages[userID];
    },
    saveMessage(message) {
        this.messages[message.to] = message;
    }
};

export default messageStore;