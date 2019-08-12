module.exports = {
    setOfficeName: name => {
        return name.toLowerCase().replace(' ', '-');
    }
};