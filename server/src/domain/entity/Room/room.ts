export default {
  createRoom() {},
  noteUserHasLeave() {},
  notUserHasJoin() {},
  fetchHistory() {},
  getAllRooms(userId: string): Record<string, any> & { id: string }[] {
    return [];
  },
};
