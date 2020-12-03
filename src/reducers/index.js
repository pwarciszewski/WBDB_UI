import { combineReducers } from 'redux'
import datatree from './datatree'
import activeframes from './activeframes'
import loglist from './loglist'
import openwindows from './openwindows'
import imagerois from './imagerois'
import availableops from './availableops'
import serverroutine from './serverroutine'

export default combineReducers({
    datatree,
    activeframes,
    loglist,
    openwindows,
    imagerois,
    availableops,
    serverroutine
})