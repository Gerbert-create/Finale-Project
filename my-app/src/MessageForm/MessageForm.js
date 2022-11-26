import React from "react";
import "./MessageForm.css"
import { Close } from "../Svg";
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../mapToProps'

class MessageForm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			licenseNumber: '', // Лизцензионный номер
			type: '', // тип велосипеда
			ownerFullName: '', // полное имя отправителя
			clientId: '', // клиент ID
			color: '', // цвет велосипеда
			date: '', // дата кража
			officer: '', // id ответственный сотрудник
			description: '', // доп. информация
			reqStatus: '', // статус запроса
			officersList: [] // массив со всеми сотрудниками
		}

		this.ClickSend = this.ClickSend.bind(this)
	}

	componentDidMount() {
		this.props.addOpenLoader(true)
		setTimeout(() => {
			if (this.props.user.approved === true) {
				// если пользователь одобрен, отправляется запрос на получение массива сотрудников
				fetch('https://skillfactory-final-project.herokuapp.com/api/officers/', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${this.props.token}`
					},
				})

					.then(response => response.json())

					.then(response => {
						this.props.addOpenLoader(false)
						if (response.status === 'ERR') {
							this.setState({ reqStatus: response.message })
						} else {
							// если запрос успешный
							this.setState({ officersList: response.officers }) // передаём в state массив сотрудников
						}
					})
			} else {
				this.props.addOpenLoader(false)
			}
		}, 3000)
	}

	ClickSend() {
		this.props.addOpenLoader(true)
		if (this.props.user.approved === true) {
			// если пользователь одобрен, отправляется запрос на отправку нового сообщения о краже
			const newOfficerMessage = {
				licenseNumber: this.state.licenseNumber,
				ownerFullName: this.state.ownerFullName,
				type: this.state.type,
				color: this.state.color,
				date: this.state.date,
				officer: this.state.officer,
				description: this.state.description,
			} // создаём новый объект с ведёнными данными, вместо clientId передаём officer

			fetch('https://skillfactory-final-project.herokuapp.com/api/cases/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.props.token}`
				},
				body: JSON.stringify(newOfficerMessage)
			})

				.then(response => response.json())

				.then(response => {
					this.props.addOpenLoader(false)
					if (response.status === "ERR") {
						this.setState({
							reqStatus: {
								status: 'ERR',
								message: 'Заполненные не все обязательные поля'
							}
						})
					} else {
						// если запрос успешный
						this.setState({
							reqStatus: {
								status: 'OK',
								message: 'Заявка успешно отправлена!'
							},
							licenseNumber: '',
							type: '',
							ownerFullName: '',
							clientId: '',
							color: '',
							date: '',
							officer: '',
							description: ''
						}) // удаляем все ведённые значении из state
					}
				})

		} else {
			// если пользователь не одобрен
			const newMessage = {
				licenseNumber: this.state.licenseNumber,
				ownerFullName: this.state.ownerFullName,
				type: this.state.type,
				clientId: this.state.clientId,
				color: this.state.color,
				date: this.state.date,
				description: this.state.description,
			} // создаём новый объект с ведёнными данными, только вместо officer передаём clientId

			fetch('https://skillfactory-final-project.herokuapp.com/api/public/report', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newMessage)
			})

				.then(response => response.json())

				.then(response => {
					this.props.addOpenLoader(false)
					if (response.status === "ERR") {
						this.setState({
							reqStatus: {
								status: 'ERR',
								message: 'Заполненные не все обязательные поля'
							}
						})
					} else {
						// если запрос умпешный
						this.setState({
							reqStatus: {
								status: 'OK',
								message: 'Заявка успешно отправлена!'
							},
							licenseNumber: '',
							type: '',
							ownerFullName: '',
							clientId: '',
							color: '',
							date: '',
							officer: '',
							description: ''
						}) // удаляем все ведённые значении из state
					}
				})
		}
	}

	render() {
		const reqStatus = this.state.reqStatus
		return (
			<div className="messageForm__body">
				<div className="text messageForm__mainBlock">
					<Link to='/'><div className="messageForm__cross-close"><Close /></div></Link>
					<h2 className="messageForm__title">Украли велосипед? <br /> Заполните форму о краже ниже</h2>
					<div className="messageForm__flex">
						<div className="messageForm__block-left">
							<label className="messageForm__license-label messageForm__label">
								Номер лицензии: <span>*</span>
								<input onChange={(e) => this.setState({ licenseNumber: e.target.value, reqStatus: {} })} className="messageForm__license-input messageForm__input" type='number' value={this.state.licenseNumber} />
							</label>

							<label className="messageForm__userName-label messageForm__label">
								ФИО: <span>*</span>
								<input onChange={(e) => this.setState({ ownerFullName: e.target.value, reqStatus: {} })} className="messageForm__userName-input messageForm__input" type='text' value={this.state.ownerFullName} />
							</label>

							<label className="messageForm__bikeType-label messageForm__label">
								Тип велосипеда: <span>*</span>
								<select onChange={(e) => this.setState({ type: e.target.value, reqStatus: {} })} className="messageForm__bikeType-select messageForm__input" value={this.state.type}>
									<option value='' selected disabled></option>
									<option value='general'>Обычный</option>
									<option value='sport'>Спортивный</option>
								</select>
							</label>

							<label className="messageForm__bikeColor-label messageForm__label">
								Цвет велосипеда:
								<input onChange={(e) => this.setState({ color: e.target.value, reqStatus: {} })} className="messageForm__bikeColor-input messageForm__input" type='text' value={this.state.color} />
							</label>

							<label className="messageForm__stealDate-label messageForm__label">
								Дата кражи:
								<input onChange={(e) => this.setState({ date: e.target.value, reqStatus: {} })} className="messageForm__stealDate-input messageForm__input" type='date' value={this.state.date} />
							</label>
						</div>

						<div className="messageForm__block-right">
							<label className="messageForm__moreInfo-label messageForm__label">
								Дополнительное информация:
								<textarea onChange={(e) => this.setState({ description: e.target.value, reqStatus: {} })} className="messageForm__moreInfo-input messageForm__input" value={this.state.description}></textarea>
							</label>


							{this.props.user.approved === true
								// выпадающий список сотрудников, появляется только если пользователь одобрен
								? <label className="messageForm__officer-label messageForm__label">
									Сотрундник: <span>*</span>
									<select onChange={(e) => this.setState({ officer: e.target.value, reqStatus: {} })} className="messageForm__officer-select messageForm__input" value={this.state.officer}>
										<option value='' disabled selected></option>
										{this.state.officersList.map(item => {
											return (
												<option value={item._id}>{item.firstName} {item.lastName}</option>
											)
										})}
									</select>
								</label>

								// поле ввода для clientID, если пользователь не одобрен
								: <label className="messageForm__stealDate-label messageForm__label">
									Ваш id: <span>*</span>
									<input onChange={(e) => this.setState({ clientId: e.target.value, reqStatus: '' })} className="messageForm__clientId-input messageForm__input" type='text' value={this.state.clientId} />
								</label>
							}

							{/* сообщение о статусе запроса */}
							<div className="messageForm__reqStatus-message messageForm__message-Ok" style={reqStatus.status === 'OK' ? { color: 'green' } : { color: 'red' }}>{this.state.reqStatus.message}</div>

							<button onClick={this.ClickSend} className="messageForm__btn-send">Отправить</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageForm)