import '../MobileMenu/MobileMenu.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {mapDispatchToProps, mapStateToProps} from '../mapToProps'

function MobileMenu(props) {

	// при нажатие на кнопку "Войти"
	const onClickLogIn = () => {
		// активипуем функцию из header для открытия окна авторизации
		props.funcOnClickLogIn()
		// передаём disactive для закрытия мобильного меню
		props.onItemsClick('disactive')
	}
	
	// при нажатие на кнопку "Выйти"
	const onLogOut = () => {
		// активипуем функцию из header для обнуление данных пользователя
		props.funcLogOut()
		// передаём disactive для закрытия мобильного меню
		props.onItemsClick('disactive')
	}

	return (
		<nav className={`mobileMenu ${props.menuState}Menu`}>
			<ul className="text mobileMenu__menu">
				{/* если пользователь не зашёл рендерится кнопка "Войти" */}
				{props.token === ''
					? 	<>
							<li onClick={() => onClickLogIn()} className="mobileMenu__item">Войти</li>
						</>
				// если пользователь зашёл, то рендерится кнопка "Выйти"
					:	<Link to='/'><li onClick={() => onLogOut()} className="mobileMenu__item">Выйти</li></Link>
				}
				{/* рендериться только для авторизованных пользователей */}
				{props.user.approved === true 
					? 	<>
							<Link to='/messageList'><li onClick={() => props.onItemsClick('disactive')} className="mobileMenu__item">Сообщений</li></Link>
							<Link to='/officersList'><li onClick={() => props.onItemsClick('disactive')} className="mobileMenu__item">Сотрудники</li></Link>
							<Link to='/messageForm'><li onClick={() => props.onItemsClick('disactive')} className="mobileMenu__item">Создать заявку на краже</li></Link>
						</>
						
					: null
				}

			</ul>
		</nav>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu)