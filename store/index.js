

export const state = () => ({
    note: {}
})

export const getters = {
    getNote: (state) => state.note
}

export const actions = {

}

export const mutations = {
    setNote: (state, currentNote) => (state.note = currentNote),
    updateEditors: (state, editors) => (state.note.Editors = editors)
}