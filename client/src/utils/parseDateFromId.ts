const parseDateFromId = (id: string) => {
    const timestamp = id.substring(0, 8);
    const date = new Date(parseInt(timestamp, 16) * 1000);
    return date;
};

export default parseDateFromId;