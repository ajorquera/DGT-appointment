module.exports = {
    setOfficeName: name => {
        return name
            .toLowerCase()
            // replace any accents 
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            // replace any spaces "/" "." ". "
            .replace(/(\. |-|\.| |\/)/g, '-');
    }
};