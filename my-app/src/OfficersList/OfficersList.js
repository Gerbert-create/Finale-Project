import React from "react";
import { Loupe, Close, Trash } from "../Svg";
import '../MessageList/MessageOfficersList.css'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import {mapDispatchToProps, mapStateToProps} from '../mapToProps'

class OfficersList extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			officersList: [], // первоначальный массив сотрудников
			renderList: [], // конечный массив сотрудников (для рендеринга)
			statusSelected: 'all', // значение select из фильтра (категория)
			inputValue: '', // значение input из фильтра
			error: '', 
		}

		this.SelectFilter = this.SelectFilter.bind(this)
		this.SearchFilter = this.SearchFilter.bind(this)
		this.GiveListByApi = this.GiveListByApi.bind(this)
		this.ClickDelete = this.ClickDelete.bind(this)
	}

	GiveListByApi() {
		// запрос на получения списка сотрудников
		if (this.props.token === '' || this.props.user.approved === true) {
			fetch('https://skillfactory-final-project.herokuapp.com/api/officers/', {
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
					// удаление зарегистрированного сотрудника из списка 
					const listWithoutUserNow = response.officers.filter(item => item._id !== this.props.user.id)
					// передаём полученный список в первоначальный массив и в конечный массив
					this.setState({ officersList: listWithoutUserNow, renderList: listWithoutUserNow })
				}
			})
		}
	}

	componentDidMount() {
		this.props.addOpenLoader(true)
		// при каждом обновления вызываем запрос
		setTimeout(() => {
			this.GiveListByApi() 
		}, 500)
	}

	SelectFilter(e) {
		// фильтрация по категориям
		// передаём выбранное значение в state, и также удаляем значение в input
		this.setState({ statusSelected: e.target.value, inputValue: ''})

		const FilterArr = () => {
			// если пользователь выбрал "все", возвращаем первоначальный массив 
			if (e.target.value === 'all') {
				return this.state.officersList
			} else {
				// если выбрал другую категорию (одобренные или не одобренные) 
				// фильтруем массив для данной категории, и получаем список обобренных или не одобренных сотрудников
				const filterByStatus = this.state.officersList.filter(item => item.approved === JSON.parse(e.target.value))
				// возвращаем полученный результат
				return filterByStatus
			}
		}
		// возвращаем функцию фильтрации в конечный массив
		this.setState({ renderList: FilterArr() })
	}

	SearchFilter(e) {
		// фильтр по именам и фамилиям
		this.setState({ inputValue: e.target.value })
		if (e.target.value === '') {
			// если input пустой, передаём в конечный массив первоначальный массив
			this.setState({ renderList: this.state.officersList })
		} else {
			// если пользователь ввёл какое нибудь значение, создаём фильтрацию по именам и фамилиям
			// фильтр по фамилиям
			const filterByLastName = this.state.officersList.filter((item) => item.lastName.toLowerCase().startsWith(e.target.value.toLowerCase()))
			// фильтр по именам
			const filterByFirstName = this.state.officersList.filter((item) => item.firstName.toLowerCase().startsWith(e.target.value.toLowerCase()))
			// создаём Set для удаление дубликатов, добавляя значение обоих фильтров
			const newSet = new Set([...filterByFirstName, ...filterByLastName])
			// передаём Set в конечный массив
			this.setState({ renderList: [...newSet] })
		}
	}

	ClickDelete(officerId) {
		this.props.addOpenLoader(true)
		// officerId - id сотрудника которого хотим удалить
		fetch(`https://skillfactory-final-project.herokuapp.com/api/officers/${officerId}`, {
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
				// вызываем запрос на получение обновлённого списка сотрудников
				this.GiveListByApi()
			})
	}

	render() {
		return (
			<div className="text officersList message-officers__body-block">
				{/* при клике на кнопку передаём через функцию true, чтобы открылось окно для создание нового пользователя */}
				<button className="officersList__btn-addOfficer" onClick={() => this.props.addCreateOfficer(true)}>Новый сотрудник</button>
				<h2 className="officersList__title message-officers__title">Список сотрудников</h2>
				<div className="officersList-block message-officers__mainBlock">
					{/* при клике на крест, через route возвращаемся на главную страницу */}
					<Link to='/'><div className='message-officers__cross'><Close /></div></Link>
					<div className="officersList__filter-flex message-officers__filter-flex">
						<label className="officersList__search-label message-officers__search-label">
							<div><Loupe /></div>
							<input onChange={this.SearchFilter} className="officersList__search-input message-officers__search-input" type='text' value={this.state.inputValue}/>
						</label>

						<select onChange={this.SelectFilter} className="officersList__search-select message-officers__search-select">
							<option selected value='all'>все</option>
							<option value='true'>одобренных</option>
							<option value='false'>не одобренных</option>
						</select>
					</div>
					<div className="officersList__list-block message-officers__list-block">
						{/* рендеринг конечного массива сотрудников */}
						{this.state.renderList.map((item) => {
								return (
									<div className="officersList__officer-block message-officers" key={item._id}>
										<div className="officersList__mainInfo message-officers__mainInfo">
											<Link to={`/profile/${item._id}`} className="officersList__officerName messageSender-officers__name"><span>{item.firstName} {item.lastName}</span></Link>
											<span className="officersList__approvement" style={item.approved === true ? { color: 'green' } : { color: 'red' }}>{item.approved === true ? 'одобрен' : 'не одобрен'}</span>
										</div>
										{/* кнопка для удаление на мобильных устройствах */}
										<div onClick={() => this.ClickDelete(item._id)} className="messageList__mobileBtn-delete message-officers__mobileBtn-delete"><Trash /></div>
										<button onClick={() => this.ClickDelete(item._id)} className="officersList__btn-delete message-officers__btn-delete">удалить</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(OfficersList)