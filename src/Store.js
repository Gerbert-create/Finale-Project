import { legacy_createStore as createStore } from 'redux'

const initialState = {
	logInClick: false, // открытия и закрытия окна авторизации
	signUpClick: false, // открытия и закрытия окна для создание нового сотрудника
	userNow: {}, // данные сотрудника
	userToken: '' // токен сотрудника
}

function reducer (state = initialState, action) {
	switch (action.type) {
		case 'LOGIN':
			return {...state, logInClick: action.value }

		case 'SIGNUP':
			return {...state, signUpClick: action.value }

		case 'USER':
			return {...state, userNow: action.value }

		case 'TOKEN':
			return {...state, userToken: action.value}

		default: return state
	}
}

const store = createStore(reducer)

export default store