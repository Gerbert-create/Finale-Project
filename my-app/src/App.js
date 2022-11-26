import './App.css';
import LoadingWindow from './LoadingWindow/LoadingWindow';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import MainPage from './MainPage/MainPage';
import UserProfile from './Profile/Profile'; //детальная страница сотрудника
import LogIn from './LogIn/LogIn'; // PopUp для входа
import MessageList from './MessageList/MessageList'; //список сообщений о краже
import OfficersList from './OfficersList/OfficersList'; //список сортудников
import MessageWindow from './MessageWindow/MessageWindow'; //детальная страница сообщения
import MessageForm from './MessageForm/MessageForm'; // форма для отправки сообщения о краже
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './mapToProps';
import CreateOfficer from './SignUp/CreateOfficer'; // PopUp для создание сотрудника

class App extends React.Component {

	componentDidMount() {
		// Запрос на валидности токена отправляется запрос если localStorage не пустой
		const savedUserToken = localStorage.getItem('userToken')
		if (savedUserToken !== null) {
			fetch('https://skillfactory-final-project.herokuapp.com/api/auth/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${savedUserToken}`
				}
			})

				.then(response => response.json())
				.then(response => {
					//если ошибка, удаляем все данные из state и открывается окно авторизации
					if (response.status === 'ERR') {
						this.props.addUserNow({})
						this.props.addUserToken('')
						this.props.addLogIn(true)
					} else {
						// если всё корректно, передаём полученные данные в state (токен, данные пользователя)
						this.props.addUserToken(response.data.token)
						this.props.addUserNow(response.data.user)
					}
				})
		}
	}

	render() {
		return (
			<BrowserRouter>
				<LoadingWindow />
				{/* открывается если пользователь нажал на кнопку 'Войти'(true)*/}
				{this.props.logIn === true
					? <LogIn />
					: null
				}
				{/* открывается если пользователь нажал на кнопку 'новый сотрудник'(true) */}
				{this.props.createOfficer === true
					? <CreateOfficer />
					: null
				}
				<Header />
				<Routes>
					{/* основная страница */}
					<Route path='/' exact element={
						<>
							<MainPage />
							<Footer />
						</>
					} />
					{/* панель меню */}
					<Route path='/profile/:id' element={<UserProfile />} />
					<Route path='/messageList' element={<MessageList />} />
					<Route path='/officersList' element={<OfficersList />} />
					<Route path='/messageWindow/:id' element={<MessageWindow />} />
					<Route path='/messageForm' element={<MessageForm />} />
				</Routes>
			</BrowserRouter>
		);
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(App)




