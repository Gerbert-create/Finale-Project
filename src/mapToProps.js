const mapStateToProps = (state) => ({
	createOfficer: state.signUpClick,
	logIn: state.logInClick,
	token: state.userToken,
	user: state.userNow,
})

const mapDispatchToProps = (dispatch) => ({
	addCreateOfficer: (value) => dispatch({type: 'SIGNUP', value: value}),
	addLogIn: (value) => dispatch({type: 'LOGIN', value: value}),
	addUserNow: (value) => dispatch({ type: 'USER', value: value }),
	addUserToken: (value) => dispatch({ type: 'TOKEN', value: value })
})

export {mapDispatchToProps, mapStateToProps}