import React from 'react'
import { DataTree, NewDataWatcher, AddWindowSelection, FileDownloader, OperationsMenu } from './components'
import './MenuBar.css'

const MenuBar = () => {
    return(
        <div className='MenuBar'>
            <DataTree />
            <FileDownloader />
            <NewDataWatcher />
            <OperationsMenu />
            <AddWindowSelection />
        </div>
    )
}

export default MenuBar