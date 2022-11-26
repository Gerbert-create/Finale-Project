import './Profile.css'
import { UserFoto } from '../Svg'
import { Close } from '../Svg'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {mapDispatchToProps, mapStateToProps} from '../mapToProps'

function UserProfile (props) {

	const [inputDisabled, setInputDisabled] = useState(true) // блокировка ввода
	const [userData, setUserData] = useState({}) // данные пользователя
	const [disabledBtnSave, setDisabledBtnSave] = useState(true) // блокировка кнопки сохранения
	const [approvement, setApprovement] = useState(false) // значение одобрения сотрудника
	const [reqStatus, setReqStatus] = useState({}) // сообщение о статусе запроса
	const [changedData, setChangedData] = useState({}) // объект изменении (заполняется при изменения значение в input)
	
	const params = useParams()
	const userId = params.id // получаем id сотрудника из ссылки

	const GetOfficerDataByApi = () => {
		fetch(`https://skillfactory-final-project.herokuapp.com/api/officers/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${props.token}`
			}
		})

		.then(response => response.json())
		.then(response => {
			props.addOpenLoader(false)
			if (response.status === 'ERR') {
				setReqStatus({
					status: 'ERR',
					message: response.message
				})
			} else {
				// если запрос успешный
				setUserData(response.data) // передаём объект данных сотрудника в state
				setApprovement(response.data.approved) // отдельно передаём значение одобрения сотрудника в state
			}
		})
	}

	useEffect(() => {
		props.addOpenLoader(true)
		setTimeout(() => {
			if (props.user.approved === true) {
				GetOfficerDataByApi()
			}
		}, 500)
	}, [props.user])

	const onClickEdit = () => {
		// при клике на кнопку "редактировать" 
		setInputDisabled(false) // разблокируем ввод
		setDisabledBtnSave(false) // разблокируем кнопку сохранить
		setReqStatus({}) // обнуляем сообщение статуса запроса
	}

	const onClickSave = () => {
		props.addOpenLoader(true)
		// при клике на кнопку сохранения
		if (Object.keys(changedData).length !== 0) {
			// если новый массив данных не пустой но отпрвляется запрос на сохранения изменении
			fetch(`https://skillfactory-final-project.herokuapp.com/api/officers/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${props.token}`
				},
				body: JSON.stringify(changedData)
			})

			.then(response => response.json())
			.then(response => {
				props.addOpenLoader(false)
				if (response.status === 'ERR') {
					setReqStatus({
						status: 'ERR',
						message: 'что то пошло не так'
					})
				} else {
					setReqStatus({
						status: 'OK',
						message: 'изменения успешно сохранены'
					})
					setChangedData(response.officer) // передаём объект с обновлёнными данными в state
					setInputDisabled(true) // блокируем ввод
					setDisabledBtnSave(true) // блокируем кнопку сохранения
					setChangedData({}) // обнуляем объект изменении
				}
			})
		}
	}

	return (
		<div className='userProfile'>
			<div className='userProfile__mainBlock'>
			<div className='userProfile__cross-closer'><Link to='/officersList'><Close/></Link></div>
				<div className='text userProfile__block-1'>
					<div className='userProfile__userMainInfo-block'>
						<div className='userProfile__userFoto'><UserFoto/></div>
						<div className='userProfile__userMainInfo'>
							<span className='userProfile__userName'>{userData.firstName} {userData.lastName}</span>
							{/* горизонтальная прямая */}
							<svg className='userProfile__line-horizontal' width="277" height="3" viewBox="0 0 277 3" fill="none" xmlns="http://www.w3.org/2000/svg">
								<line x1="0.354492" y1="1.5" x2="276.652" y2="1.5" stroke="white" strokeWidth="3"/>
							</svg>
							<span className='userProfile__userEmail'>{userData.email}</span>
						</div>
					</div>
					<div className='userProfile__userId'>id: {userData._id}</div>
					<label className='userProfile__approve-label'>
						<input onChange={() => {
							// при клике на checkbox значение, в зависимости от первончальное, меняется на противоположное
							setApprovement(!approvement); // передаём значение в state
							setChangedData({...changedData, approved: !approvement}) // передаём значение в объект изменения
							setDisabledBtnSave(false) // разблокируем кнопку сохранения
							setReqStatus({}) // обнуляем сообщение о статусе запроса
						}}
							className={`userProfile__approve-checkbox ${approvement === true ? 'approved' : null}`} type='checkbox'/>
						Одобрен
					</label>
				</div>

				{/* ветикальная прямая */}
				<span className='userProfile__line-vertical'>
					<svg width="3" height="448" viewBox="0 0 3 448" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="3" height="448" fill="#F9F9F9"/>
					</svg>
				</span>

				<div className='text userProfile__block-2'>
					<label className='userProfile__userPhone-label userProfile__label'>
						Пароль сотрудника:
						<input onChange={e => setChangedData({...changedData, password: e.target.value})} disabled={ inputDisabled } className='userProfile__phone-input userProfile__input' type='password' defaultValue={userData.password} style={inputDisabled === false ? {caretColor: 'white'} : null}/>
					</label>
					<label className='userProfile__userAddress-label userProfile__label'>
						Имя сотрудника:
						<input onChange={e => setChangedData({...changedData, firstName: e.target.value})} disabled={ inputDisabled } className='userProfile__userAddress-input userProfile__input' type='text' defaultValue={userData.firstName} style={inputDisabled=== false ? {caretColor: 'white'} : null}/>
					</label>
					<label className='userProfile__userBirthDate-label userProfile__label'>
						Фамилия сотрудника:
						<input onChange={e => setChangedData({...changedData, lastName: e.target.value})} disabled={ inputDisabled } className='userProfile__userBirthDate-input userProfile__input' type='text' defaultValue={userData.lastName} style={inputDisabled === false ? {caretColor: 'white'} : null}/>
					</label>

					<span style={reqStatus === 'ERR' ? {color: 'red'} :  {color: 'green'}}>{reqStatus.message}</span>

					<div className='userProfile__btn-flex'>
						<button onClick={() => onClickEdit() } className='userProfile__btn-edit userProfile__btn'>Редактировать</button>
						<button disabled={disabledBtnSave} onClick={() => onClickSave() } className='userProfile__btn-save userProfile__btn'>Сохранить</button>	
					</div>
				</div>
			</div>
		</div>
		)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)