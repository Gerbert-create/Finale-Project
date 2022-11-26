import { GesPos, Email, Phone } from "../Svg"
import './Footer.css'

function Footer () {
	return (
		<footer className='footer'>
			<div className='text footer__block'>
				<h1 className='footer__title'>BikeDRIVE.ru</h1>
				<div className='footer__geoLoc footer__items-block'>
					<GesPos/>
					<span className='footer__geoLoc__text footer__text'>Москва; ул. Александровская; д. 4</span>
				</div>

				<div className='footer__email footer__items-block'>
					<Email/>
					<span className='footer__email__text footer__text'>bikedrive.tp@gmail.com</span>
				</div>

				<div className='footer__phone footer__items-block'>
					<Phone/>
					<span className='footer__phone__text footer__text'>+7 999 999 99 99</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer