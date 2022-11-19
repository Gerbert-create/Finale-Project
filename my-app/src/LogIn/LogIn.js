import React from "react";
import './LogIn.css'
import { Close } from "../Svg";
import { connect } from 'react-redux'
import {mapDispatchToProps, mapStateToProps} from '../mapToProps'

// ОКНО АВТОРИЗАЦИИ
class LogIn extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			password: '',
			reqStatus: '',
		}

		this.ClickLogIn = this.ClickLogIn.bind(this)
	}
	
	ClickLogIn() {
		// новый объект для отправки на сервер
		const userLog = {
			email: this.state.email,
			password: this.state.password,
		}

		fetch('https://skillfactory-final-project.herokuapp.com/api/auth/sign_in', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userLog),
		})

		.then(response => response.json())

		.then(response => {
			if (response.status === 'ERR') {
				this.setState({ reqStatus: response.status })
			} else {
				this.setState({ reqStatus: response.status })
				this.props.addUserNow(response.data.user) // передача данных пользователья основному state
				this.props.addUserToken(response.data.token) // передача токена пользователья основному state
				this.props.addLogIn(false) // закрытия окна авторизации
				// передача данных в localStorage
				localStorage.setItem('userToken', response.data.token) 
				const userData = JSON.stringify(response.data.user)
				localStorage.setItem('user', userData)
			}
		})
	}

	render() {
		return (
			<div className="logIn-body">
				<div className='logIn'>
					<div onClick={() => this.props.addLogIn(false)} className="logIn__cross-close"><Close/></div>
					{/* отправка запроса по нажатию на enter  */}
					<div onKeyDown={e => e.key === 'Enter' ? this.ClickLogIn() : null} className="text logIn-block">
						<h2 className="logIn__title">Войти</h2>
						<label className="logIn__email-label logIn__label">
							Почта:
							<input onChange={e => this.setState({ email: e.target.value, reqStatus: '' })} className="logIn__email-input logIn__input" type='text' />
						</label>
						<label className="logIn__password-label logIn__label">
							Пароль:
							<input onChange={e => this.setState({ password: e.target.value, reqStatus: '' })} className="logIn__password-input logIn__input" type='password' />
						</label>
						{/* сообщение об ошибке, появляется при ошибке запроса */}
						{this.state.reqStatus === 'ERR'
							? <div className="logIn__error">Неверный логин или пароль</div>
							: null
						}
						<button type="submit"  onClick={this.ClickLogIn} className="logIn__btn">Далее</button>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)