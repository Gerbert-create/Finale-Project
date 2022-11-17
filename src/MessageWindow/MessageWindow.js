import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Close } from "../Svg";
import { Link } from "react-router-dom";
import './MessageWindow.css'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../mapToProps'

function MessageWindow(props) {

	const [messageData, setMessageData] = useState({}) // объект данных сообщения
	const [reqStatus, setReqStatus] = useState('') // статус запроса
	const [inputDisabled, setInputDisabled] = useState(true) // блокировка ввода
	const [changedData, setChangedData] = useState({}) // объект изменении
	const [finishBtnDisabled, setFinishBtnDisabled] = useState(false) // блокировка кнопки завершение
	const [active, setActive] = useState('') // имя класса передаваемая при активности
	const [createAtDate, setCreateAtDate] = useState('') // дата создания
	const [updatedAtDate, setUpdatedDate] = useState('') // дата последнего обновление
	const [dateTheft, setDateTheft] = useState('') // дата краже

	const ownerFullNameRef = useRef()
	const licenseNumberRef = useRef()
	const typeRef = useRef()
	const colorRef = useRef()
	const descriptionRef = useRef()
	const resolutionRef = useRef()

	const params = useParams()
	const messageId = params.id // получаем id сообщения через ссылку

	const GetMessageDataByApi = () => {
		// запрос на получение данных сообщения
		fetch(`https://skillfactory-final-project.herokuapp.com/api/cases/${messageId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${props.token}`
			}
		})

			.then(response => response.json())
			.then(response => {
				if (response.status === 'ERR') {
					setReqStatus({
						status: 'ERR',
						message: 'Что то пошло не так'
					})
				} else {
					setMessageData(response.data) // если звапрос успешный передаём объект данных в state
					// передаём все первоначальные значений в input через ref
					ownerFullNameRef.current.value = response.data.ownerFullName
					licenseNumberRef.current.value = response.data.licenseNumber
					typeRef.current.value = response.data.type
					colorRef.current.value = response.data.color
					descriptionRef.current.value = response.data.description
					resolutionRef.current.value = response.data.resolution
					// переводим в нужны формат все даты
					if (response.data.createdAt !== null) {
						const createdAt = new Date(response.data.createdAt) // дата создания
						const createdAtDate = Intl.DateTimeFormat().format(createdAt)
						setCreateAtDate(createdAtDate)
					}
					if (response.data.updatedAt !== null) {
						const updatedAt = new Date(response.data.updatedAt) // дата последнего обновления
						const updatedAtDate = Intl.DateTimeFormat().format(updatedAt)
						setUpdatedDate(updatedAtDate)
					}
					if (response.data.date !== null) {
						const date = new Date(response.data.date) // дата кража
						const dateTheft = Intl.DateTimeFormat('en-CA').format(date)
						setDateTheft(dateTheft)
					}
				}
			})
	}

	useEffect(() => {
		// при каждом обновления вызываем запрос, срабатывает как только получили объект данных пользователя и если данный пользователь одобрен
		setTimeout(() => {
			if (props.user.approved === true) {
				GetMessageDataByApi()
			}
		}, 500)
	}, [props.user])

	const sendChange = () => {
		// запром на отправку изменении, при клике на кнопку сохранение
		fetch(`https://skillfactory-final-project.herokuapp.com/api/cases/${messageId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${props.token}`
			},
			// при первом изменения статус переходит "в обработке"
			body: JSON.stringify({ ...changedData, status: 'in_progress' })
		})
			.then(response => response.json())
			.then(response => {
				if (response.status === 'ERR') {
					setReqStatus({
						status: 'ERR',
						message: response.message
					})
				} else {
					// если запрос успешный
					setReqStatus({
						status: 'OK',
						message: 'Изменений успешно сохранены'
					})
					setMessageData(response.data) // передаём новый полученный объект с изменёнными данными
					setInputDisabled(true) // блокируем ввод
					setFinishBtnDisabled(false) // разблокируем кнопку завершения
					setActive('') // удаляем класс активации стили
					setChangedData({}) // удаляем содержимое объекта изменении
				}
			})
	}

	const Finish = () => {
		// запром на отправку изменении, при клике на кнопку завершения (передаётся только статус "завершён")
		if (messageData.resolution !== null) {
			// запрос отправляется только если поля решение не пустое
			fetch(`https://skillfactory-final-project.herokuapp.com/api/cases/${messageId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${props.token}`
				},
				body: JSON.stringify({ status: 'done' })
			})

				.then(response => response.json())
				.then(response => {
					if (response.status === 'ERR') {
						setReqStatus({
							status: 'ERR',
							message: response.message
						})
					} else {
						// если запрос успешный
						setMessageData(response.data) // передаём новый полученный объект с изменёнными данными
						setReqStatus({}) // удаляется сообщение об ошибки если оно было до этого
						setInputDisabled(true) // блокируем ввод
					}
				})
		} else {
			// если поля решения пустое рендерится сообщение об ошибки
			setReqStatus({
				status: 'ERR',
				message: 'Не заполнены все обязательные поля для завершения'
			})
		}
	}

	return (
		<div className="messageWindow">
			<div className="text messageWindow-flex">
				<div className="messageWindow__cross-close"><Link to='/messageList'><Close /></Link></div>
				<div className="messageWindow__message-block-left">
					<label className="messageWindow__username-label messageWindow__label">
						ФИО:
						<input ref={ownerFullNameRef} onChange={(e) => setChangedData({ ...changedData, ownerFullName: e.target.value })} disabled={inputDisabled} className={`messageWindow__username-input messageWindow__input ${active}`} type='text' />
					</label>

					<label className="messageWindow__license-label messageWindow__label">
						Номер лицензии:
						<input ref={licenseNumberRef} onChange={(e) => setChangedData({ ...changedData, licenseNumber: e.target.value })} disabled={inputDisabled} className={`messageWindow__license-input messageWindow__input ${active}`} type='number' />
					</label>

					<label className="messageWindow__bikeType-label messageWindow__label">
						Тип велосипеда:
						<select ref={typeRef} onChange={(e) => setChangedData({ ...changedData, type: e.target.value })} disabled={inputDisabled} className={`messageWindow__bikeType-input messageWindow__input ${active}`} type='text' defaultValue={messageData.type}>
							<option disabled={messageData.type === 'general' ? true : false} value='general'>обычный</option>
							<option disabled={messageData.type === 'sport' ? true : false} value='sport'>спортивный</option>
						</select>
					</label>

					<label className="messageWindow__bikeColor-label messageWindow__label">
						Цвет велосипеда:
						<input ref={colorRef} onChange={(e) => setChangedData({ ...changedData, color: e.target.value })} disabled={inputDisabled} className={`messageWindow__bikeColor-input messageWindow__input ${active}`} type='text' />
					</label>

					<div className="messageWindow__date-flex">
						<div className="messageWindow__stealDate-block messageWindow__date-block">
							<span className="messageWindow__stealDate-title">Дата кражи:</span>
							<input onChange={(e) => setChangedData({ ...changedData, date: e.target.value })} disabled={inputDisabled} className="messageWindow__stealDate-input messageWindow__date" type='date' defaultValue={dateTheft} />
						</div>

						<div className="messageWindow__changesDate-block messageWindow__date-block">
							<span className="messageWindow__changesDate-title">Дата создания:</span>
							<span className="messageWindow__changesDate-date messageWindow__date">{createAtDate}</span>
						</div>

						<div className="messageWindow__changesDate-block messageWindow__date-block">
							<span className="messageWindow__changesDate-title">Дата последних изменений:</span>
							<span className="messageWindow__changesDate-date messageWindow__date">{updatedAtDate}</span>
						</div>
					</div>
				</div>

				<div className="messageWindow__message-block-right">
					<label className="messageWindow__moreInfo-label messageWindow__label">
						Дополнительное информация:
						<textarea ref={descriptionRef} onChange={(e) => setChangedData({ ...changedData, description: e.target.value })} disabled={inputDisabled} className={`messageWindow__moreInfo-input messageWindow__input ${active}`} type='text'></textarea>
					</label>

					<label className="messageWindow__dicision-label messageWindow__label">
						Решение: <span>*</span>
						<textarea placeholder="Для завершения заполоните поля" ref={resolutionRef} onChange={(e) => setChangedData({ ...changedData, resolution: e.target.value })} disabled={inputDisabled} className={`messageWindow__decision-input messageWindow__input ${active}`} type='text'></textarea>
					</label>

					<div className="messageWindow__errorMessage" style={reqStatus.status === 'ERR' ? { color: 'red' } : { color: 'green' }}>{reqStatus.message}</div>
					<div className="messageWindow__btn-flex">
						{messageData.status !== 'done'
							? <>
								{/* если inputDisabled = true значит кнопка "редактировать" если false значит "Отмена" */}
								<button onClick={() => {
									if (inputDisabled === false) {
										// при клике на кнопку "отменить"
										GetMessageDataByApi() // отправляем новый запрос для получение первончального массива, чтобы все поля вернулись к первоначальным значениям (отменяются веддённые изменении)
										setFinishBtnDisabled(false) // разблокируем кнопку завершения
										setActive('') // удаляем класс активации стили
									} else {
										// при клике на кнопку "редактировать"
										setFinishBtnDisabled(true) // блокируем кнопку завершения
										setActive('activeInput') // добавляем класс активация стили
										setReqStatus({}) // удаляется сообщение об ошибки если оно было до этого
									}
									// при каждом клике меняется состояние блокировки на противоположное
									setInputDisabled(!inputDisabled)

								}} className="messageWindow__btn-edit messageWindow__btn" style={inputDisabled === false ? { backgroundColor: 'rgba(239, 87, 87, 1)' } : null}>{inputDisabled === false ? 'Отменить' : 'Редактировать'}</button>
								{/* если объект изменения пустой, то кнопка сохранения блокируется */}
								<button disabled={Object.keys(changedData).length === 0 ? true : false} onClick={() => sendChange()} className="messageWindow__btn-save messageWindow__btn">Сохранить изменении</button>
								<button disabled={finishBtnDisabled} onClick={() => Finish()} className="messageWindow__btn-finish messageWindow__btn">Завершить</button>
							</>
							: null
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageWindow)