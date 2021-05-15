const sessionStore = {
    sessions: {
    },
    findSession(sessionID) {
        const result = this.sessions[sessionID];
        if (result) {
            return result;
        }
        throw new Error(`session: ${sessionID} not has exist`)
    },
    saveSession(id, session) {
        this.sessions[id] = session;
    }
}

export default sessionStore;