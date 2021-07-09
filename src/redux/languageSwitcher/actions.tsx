
const actions = {
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
    changeLanguage: (language: string) => ({
        type: actions.CHANGE_LANGUAGE,
        language
    })
};
export default actions;
