import './MainPage.css'
import { Pig, Speed, CheckMark } from '../Svg'
import { Link } from 'react-router-dom'
import './MainPageAnimation.css'


function MainPage () {
	return (
			<div className='main-block'>
				<div className='section-1'>
						<div className='section-1__content-block'>
							<h2 className='text section-1__content-block__title'>BikeDRIVE</h2>
							<div className='text section-1__content-block__description'>Единая платформа для аренды велосипедов в крупных городах России</div>
							<button className='text section-1__content-block__btn'>Звоните</button>
						</div>
						<div className='section-1__img'></div>
				</div>

				<div className='section-2'>
					<ul className='text section-2__content-1'>
						<li className='section-2__content-1__items'>Надоели большие потоки людей в метрополитене ? </li>
						<li className='section-2__content-1__items'>Передвигаться на такси выходит слишком дорого и хотите передвегаться по городу с минимальными затрами ?</li>
						<li className='section-2__content-1__items'>Любите путешествовать по городам России ?</li>
					</ul>
					
					<div className='text section-2__content-2'>
						Вы можете зайти в любой из наших центров
						и взять на пракат любой по вашему вкусу велосипед. 
						<br/> Оформим быстро и легко
					</div>
				</div>

				<div className='section-3'>
					<div className='text section-3__card-1 card'>
						<h2 className='section-3__card-1__title card__title'>01</h2>
						<div className='section-3__card-1__desc card__desc'>Жители городов, устали от пробок и проблем с парковками, но есть простое решение - велосипед</div>
					</div>

					<div className='text section-3__card-2 card'>
						<h2 className='section-3__card-2__title card__title'>02</h2>
						<div className='section-3__card-2__desc card__desc'>Никакого бензина и никаких выхлопных газов — чтобы сдвинуться с места нужны лишь ноги</div>
					</div>

					<div className='text section-3__card-3 card'>
						<h2 className='section-3__card-3__title card__title'>03</h2>
						<div className='section-3__card-3__desc card__desc'>На велосипеде можно поехать короткой дорогой, минуя пробки и оживленные улицы. Вам не придется ездить кругами, высматривая подходящее парковочное место</div>
					</div>

					<div className='text section-3__card-4 card'>
						<h2 className='section-3__card-4__title card__title'>04</h2>
						<div className='section-3__card-4__desc card__desc'>Во время езды стоя укрепляются мышцы спины, живота и ног, тренируется вестибулярный аппарат. Велосипед — отличный тренажер, подходящий как взрослым, так и детям</div>
					</div>
				</div>

				<div className='section-4'>
					<div className='section-4__img'></div>
					<ul className='text section-4__advantage'>
						<li className='section-4__advantage__item1 section-4__advantage_items'>
							<div><Pig/></div>
							<div className='section-4__advantage__item1__text-block section-4__advantage__text-block'>
								<p className='section-4__advantage__item1__text-block__title section-4__advantage__text-block__title'>Недорого</p>
								<span className='section-4__advantage__item1__text-block__desc section-4__advantage__text-block__desc'>{`(5р / мин)`}</span>
							</div>
						</li>

						<li className='section-4__advantage__item2 section-4__advantage_items'>
							<div><Speed/></div>
							<div className='section-4__advantage__item2__text-block section-4__advantage__text-block'>
								<p className='section-4__advantage__item2__text-block__title section-4__advantage__text-block__title'>Быстро</p>
								<span className='section-4__advantage__item2__text-block__desc section-4__advantage__text-block__desc'>без лишних документов {`(только паспорт)`}</span>
							</div>
						</li>

						<li className='section-4__advantage__item3 section-4__advantage_items'>
							<div><CheckMark/></div>
							<div className='section-4__advantage__item3__text-block section-4__advantage__text-block'>
								<p className='section-4__advantage__item3__text-block__title section-4__advantage__text-block__title'>Практично</p>
								<span className='section-4__advantage__item3__text-block__desc section-4__advantage__text-block__desc'>современные лёгкие велосипеды</span>
							</div>
						</li>
					</ul>
				</div>

				<div className='text section-5'>
					<div className='section-5__text'>Украли велосипед? Нажмите сюда</div>
					<Link to='/messageForm'><button className='section-5__btn'>Сообщить о краже</button></Link>
				</div>
			</div>
	)
}

export default MainPage