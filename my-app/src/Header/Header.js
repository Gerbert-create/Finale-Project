import { LogIn, Profile, Menu } from "../Svg"
import './Header.css'
import { NavLink, Link } from "react-router-dom"
import { useState } from "react"
import MobileMenu from "../MobileMenu/MobileMenu"
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../mapToProps'


function Header(props) {

	const [menuClick, setMenuClick] = useState('') // состояние по нажатию на стрелку меню
	const activeUnderline = {
		textDecoration: 'underline'
	}

	// при клике на 'Войти' передаём true для открытия окна авторизации
	const OnClickLogIn = () => {
		props.addLogIn(true)
	}

	// при клике на 'Выйти'
	const OnLogOut = () => {
		props.addCreateOfficer(false)
		props.addUserNow({}) // удаляем данные пользователя из state
		props.addUserToken('') // удаляем токен из state
		localStorage.removeItem('user') // удаляем данные пользователя из localStorage
		localStorage.removeItem('userToken') // удаляем токен из localStorage
	}

	// при клике на стрелку меню открывается мобильное окно меню (стрелка появляется на мобильных устройствах)
	const MenuCLick = () => {
		// если меню был уже активны, передаём disactive для закрытия меню
		if (menuClick === 'active') {
			setMenuClick('disactive')
		} else {
			// если меню не был активны, передаём active для открытия меню
			setMenuClick('active')
		}
	}

	// при клике на любую рассыку из мобильного меню, передаём disactive для закрытия меню
	const OnItemsMenuClick = (disactive) => {
		setMenuClick(disactive)
	}

	return (
		<>
			<header className='header'>
				<div className='text header__header-block'>
					<h1 className='header__title'>BikeDRIVE.ru</h1>
					<nav className='header__menu'>
						{/* меню появляется только для авторизованныз пользователей */}
						{props.user.approved === true
							? <>
								<NavLink to='/messageList' className={({isActive}) => isActive ? 'header__item_active' : null}><span className="header_messageList header_menu-item">Сообщений</span></NavLink>
								<NavLink to='/officersList' className={({isActive}) => isActive ? 'header__item_active' : null}><span className="header__officers header_menu-item">Сотрудники</span></NavLink>
								<NavLink to='/messageForm' className={({isActive}) => isActive ? 'header__item_active' : null}><span className="header__send-message header_menu-item">Создать заявку</span></NavLink>
							</>
							: null
						}
					</nav>

					{/* стрелка мобильного меню */}
					<div onClick={() => MenuCLick()} className={`header__mobile-menu ${menuClick}`}><Menu /></div>

					<div className='header__registration-block'>
						<LogIn />
						<div className='header__registration'>
							{/* если токен пустой значит пользователь вышел или не вошёл */}
							{props.token === ''
								? // отображаем кнопку 'Войти'
								<>
									<span onClick={OnClickLogIn} className='header__link-logIn header_menu-item'>Войти</span>
								</>
								:	// если пользователь вошёл, отображаем кнопку 'Выйти', имя фамилия пользователя, который вошёл
								<>
									<Link to='/'><span onClick={OnLogOut} className='header__link-logIn header_menu-item'>Выйти</span></Link>
									<span className='header__userName'>{props.user.firstName} {props.user.lastName}</span>
									<Profile />
								</>
							}
						</div>

					</div>
				</div>
			</header>
			{/* при нажатие на стрелку мобильного меню с помощью active открывается мобильное меню 
			Также передаём в props функции OnItemsMenuClick, OnClickLogIn, OnLogOut и состояние menuClick
			*/}
			{menuClick === 'active'
				? <MobileMenu onItemsClick={OnItemsMenuClick} menuState={menuClick} funcOnClickLogIn={OnClickLogIn} funcLogOut={OnLogOut} />
				: null
			}

		</>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)