import Globals from './global.js';

const Database = {
    loadData() {
        const maxPlayerPoints = localStorage.getItem('maxPlayerPoints') || 0;

        Globals.maxPlayerPoints = +maxPlayerPoints;
    },

    saveData(datas) {
        if(Array.isArray(datas)) {
            datas.forEach(({ key, value }) => {
                localStorage.setItem(key, value);
            });
        } else if(typeof datas === 'object') {
            localStorage.setItem(datas.key, datas.value);
        }

    }
};

export default Database;