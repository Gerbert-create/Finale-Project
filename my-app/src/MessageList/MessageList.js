import React from "react";
import { Loupe, Close, Trash } from "../Svg";
import './MessageOfficersList.css'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import {mapDispatchToProps, mapStateToProps} from '../mapToProps'

class MessageList extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			messageList: [], // первичный массив сообщении
			error: '', // сообщение об ошибке
			inputValue: '', // значение input из фильтра
			renderList: [], // конечный массив сообщении (который рендериться)
			statusSelected: 'all', // значение select из фильтра (категория)
			rerender: false,
		}

		this.SearchFilter = this.SearchFilter.bind(this)
		this.SelectFilter = this.SelectFilter.bind(this)
		this.ClickDelete = this.ClickDelete.bind(this)
		this.GiveListByApi = this.GiveListByApi.bind(this)
	}

	GiveListByApi() {
		// запрос на получения массива сообщении
		if (this.props.token !== '' || this.props.user.approved === true) {
		fetch('https://skillfactory-final-project.herokuapp.com/api/cases/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.props.token}`
			}
		})

			.then(response => response.json())

			.then(response => {
				this.props.addOpenLoader(false)
				if (response.status === 'ERR') {
					this.setState({ error: response.errCode })
				} else {
					this.setState({ messageList: response.data, renderList: response.data }) // если запрос успешный ответ перекидывается результат в первичный и в конечный масив
				}
			})
		}
	}

	componentDidMount() {
		// при кажом рендеринге отправляется запрос
		this.props.addOpenLoader(true)
		setTimeout(() => {
			this.GiveListByApi()
		}, 500)	
	}

	SearchFilter(e) {
		// фильтрация по фамилии клиента или по номеру лицензии
		this.setState({ inputValue: e.target.value })
		const filteredArr = () => {
			if (e.target.value === '') {
				// если input пустой то возвращается первичный массив
				return this.state.messageList
			} else if (isNaN(Number(e.target.value))) {
				// если в input ввели буквы то происходит фильтрация по фамилиям
				// новый массив полученный от фильтрации первичного массива
				const filterByName = this.state.messageList.filter((item) => item.ownerFullName.toLowerCase().startsWith(e.target.value.toLowerCase()))
				// возращаем этот массив
				return filterByName
			} else {
				// если в input ввели цифры происходит фильтрацию по номеру лицензии
				// новый массив полученный от фильтрации первичного массива
				const filterByLicense = this.state.messageList.filter((item) => item.licenseNumber.toLowerCase().startsWith(e.target.value.toLowerCase()))
				// возращаем этот массив
				return filterByLicense
			}
		}
		// возвращаем новый массив в конечный массив
		this.setState({ renderList: filteredArr() })
	}

	SelectFilter(e) {
		// фильтрации по статусу сообщении
		this.setState({ statusSelected: e.target.value, inputValue: '' })
		if (e.target.value === 'all') {
			// если выбрали 'все' то возвращаем первичный массив в конечный массив
			this.setState({ renderList: this.state.messageList })
		} else {
			// если выбрали другое (в обработки или завершённые) создаётся новый массив с помощью фильтрации первичного массива по статусам 
			const filterByStatus = this.state.messageList.filter((item) => item.status === e.target.value)
			// возвращаем новый массив в конечный массив
			this.setState({ renderList: filterByStatus })
		}
	}

	ClickDelete(messageId) {
		this.props.addOpenLoader(true)
		// запрос на удаления сообщения с помощью id
		fetch(`https://skillfactory-final-project.herokuapp.com/api/cases/${messageId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.props.token}`
			}
		})

			.then(response => response.json())
			.then(response => {
				this.props.addOpenLoader(false)
				if (response.status === 'ERR') {
					this.setState({ error: response.errCode })
				}
				this.GiveListByApi() // если запрос успешный то заново отправляем запрос на получение массива сообщении
			})

	}

	render() {
		return (
			<div className="text messageList message-officers__body-block">
				<h2 className="messageList__title message-officers__title">Сообщения о кражах</h2>
				<div className="messageList-block message-officers__mainBlock">
					<Link to='/'><div className="message-officers__cross"><Close /></div></Link>
					<div className="messageList__filter-flex message-officers__filter-flex">
						<label className="messageList__search-label message-officers__search-label">
							<Loupe />
							<input onChange={this.SearchFilter} className="messageList__search-input message-officers__search-input" type='text' value={this.state.inputValue} />
						</label>

						<select defaultValue='all' onChange={this.SelectFilter} className="messageList__search-select message-officers__search-select">
							<option selected value='all'>все</option>
							<option value='new'>новые</option>
							<option value='in_progress'>в обработке</option>
							<option value='done'>завершенные</option>
						</select>
					</div>

					<div className="messageList__list-block message-officers__list-block">

						{this.state.renderList.map((item) => {
								return (
									<div className="messageList__message-block message-officers" key={item._id}>
										<div className="messageList__mainInfo message-officers__mainInfo">
											<Link to={`/messageWindow/${item._id}`} style={{ textDecoration: 'none'}} ><span className="messageList__license">{item.licenseNumber}</span></Link>
											<span className='messageList__sendersName messageSender-officers__name'>{item.ownerFullName}</span>
											<span className={`messageList__messageStatus ${item.status}`}>{item.status === 'new' ? 'новый' : item.status === 'in_progress' ? 'в обработке' : item.status === 'done' ? 'завершен' : null}</span>
										</div>
										{/* кнопка для удаление на мобильных устройствах */}
										<div onClick={() => this.ClickDelete(item._id)} className="messageList__mobileBtn-delete message-officers__mobileBtn-delete"><Trash /></div>
										<button onClick={() => this.ClickDelete(item._id)} className="messageList__btn-delete message-officers__btn-delete">удалить</button>
									</div>
								)
							})

						}
					</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)