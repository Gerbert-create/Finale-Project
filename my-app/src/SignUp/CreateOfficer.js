import React from "react";
import './CreateOfficer.css'
import { Close } from "../Svg";
import { connect } from 'react-redux'
import {mapDispatchToProps, mapStateToProps} from '../mapToProps'

// ОКНО ДЛЯ СОЗДАНИЯ НОВОГО СОТРУДНИКА
class CreateOfficer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			approved: false,
			againEnterPassword: '',
			reqStatus: '',
		}

		this.ClickSignUp = this.ClickSignUp.bind(this)
	}

	ClickSignUp() {
		// отправляется запрос при клике на кнопку 'зарегистрировать'
		if (this.state.againEnterPassword !== this.state.password) {
			// если повторный введённый пароль не совпадает с первоначальным запрос не отправляется и выводится сообщение об ошибке
			this.setState({ againEnterPassword: '', password: '', reqStatus: 'неверный пароль' })
		} else {
			// новый объект для отправки на сервер
			const newOfficer = {
				email: this.state.email,
				password: this.state.password,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				approved: this.state.approved
			}

			fetch('https://skillfactory-final-project.herokuapp.com/api/officers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.props.token}`
				},
				body: JSON.stringify(newOfficer)
			})

				.then(response => response.json())

				.then(response => {
					if (response.status === 'ERR') {
						this.setState({ reqStatus: 'заполненые не все обязательные поля' }) // сообщение об ошибке
					} else {
						this.props.addCreateOfficer(false) // закрытие окна
					}
				})
		}
	}

	render() {
		return (
			<div className="createOfficer-body">
				<div className="createOfficer">
					<div onClick={() => this.props.addCreateOfficer(false)} className="createOfficer__cross-close"><Close /></div>
					{/* отправка запроса по нажатию на enter  */}
					<div onKeyDown={e => e.key === 'Enter' ? this.ClickSignUp() : null} className="text createOfficer-block">
						<h2 className="createOfficer__title">Регистрация</h2>

						<label className="createOfficer__userEmail-label createOfficer__label">
							Почта: <span>*</span>
							<input onChange={e => this.setState({ email: e.target.value, reqStatus: '' })} className="createOfficer__userEmail-input createOfficer__input" type='text' />
						</label>


						<label className="createOfficer__userPassword-label createOfficer__label">
							Пароль: <span>*</span>
							<input onChange={e => this.setState({ password: e.target.value, reqStatus: '' })} className="createOfficer__userPassword-input createOfficer__input" type='password' value={this.state.password} />
						</label>


						<label className="createOfficer__userPassword-label createOfficer__label">
							Введите пароль ещё раз: <span>*</span>
							<input onChange={e => this.setState({ againEnterPassword: e.target.value, reqStatus: '' })} className="createOfficer__userPassword-input createOfficer__input" type='password' value={this.state.againEnterPassword} />
						</label>


						<label className="createOfficer__userName-label createOfficer__label">
							Имя:
							<input onChange={e => this.setState({ firstName: e.target.value, reqStatus: '' })} className="createOfficer__userName-input createOfficer__input" type='text' />
						</label>


						<label className="createOfficer__userSurname-label createOfficer__label">
							Фамилия:
							<input onChange={e => this.setState({ lastName: e.target.value, reqStatus: '' })} className="createOfficer__userSurname-input createOfficer__input" type='text' />
						</label>
						
						{/* сообщение об ошибке, появляется при ошибке запроса */}
						<span style={{color: 'red'}}>{this.state.reqStatus}</span>

						<label className="createOfficer__approve-label">
							{/* при клике добавляется дополнительный класс 'officerApproved' для активации стили (галочка) в CSS */}
							<input onChange={() => { this.setState({ approved: !this.state.approved }) }} className={`createOfficer__approve-checkbox ${this.state.approved === true ? 'officerApproved' : null}`} type='checkbox'/>
							Одобрен
						</label>

						<button onClick={this.ClickSignUp} className="createOfficer__btn">Зарегистрировать</button>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOfficer)