export const SET_USER = 'SET_USER';

export const setUser = ({ uid, nickname })=>({
    type:SET_USER,
    payload:{ uid, nickname },
});