import './LoadingWindow.css'
import { Loading } from '../Svg'
import { connect } from 'react-redux'
import {mapDispatchToProps, mapStateToProps} from '../mapToProps'

function LoadingWindow (props) {
	return (
		<>
			{props.openLoader === true
				?		
				<div className='text loader-body'>
					<div className="loader">
						<Loading/>
						<span>Идёт загрузка</span>
					</div>
				</div>
				: null
			}
		</>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingWindow)