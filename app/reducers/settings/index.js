import { REHYDRATE } from 'redux-persist';
import AppConstants from '../../core/AppConstants';

const initialState = {
	searchEngine: AppConstants.DEFAULT_SEARCH_ENGINE,
	lockTime: AppConstants.DEFAULT_LOCK_TIMEOUT
};

const settingsReducer = (state = initialState, action) => {
	switch (action.type) {
		case REHYDRATE:
			if (action.payload && action.payload.settings) {
				return { ...state, ...action.payload.settings };
			}
			return state;
		case 'SET_SEARCH_ENGINE':
			return {
				...state,
				searchEngine: action.searchEngine
			};
		case 'SET_LOCK_TIME':
			return {
				...state,
				lockTime: action.lockTime
			};
		default:
			return state;
	}
};
export default settingsReducer;