import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllDataTree, fetchData } from '../../../../api'
import { loadDataTree, setActiveFrames } from '../../../../actions'

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import './DataTree.css'


function extractNodesFromInternalIDs(ids_list, state) {
    let nodes = []

    for(let id_i in ids_list){
        let extracted_id = ids_list[id_i]._id
        let address = extracted_id.split('-')

        address.shift()
        address = address.map(i=>(Number(i)))
        let last_add = address.pop()

        let node = state

        for(let l in address) {
            node = node[address[l]].children
        }
        node = node[last_add]
        
        nodes.push(node)
    }
    return(nodes)
}


function getFramesIDsFromTree(nodes_list) {
    let IDs = []
    for(let node_i in nodes_list) {
        if(nodes_list[node_i].hasOwnProperty('value')){
            IDs.push(Number(nodes_list[node_i].value))
        } else {
            IDs.push(...getFramesIDsFromTree(nodes_list[node_i].children))
        }
    }
    return IDs
}


const DataTree = () => {
    const data = useSelector(state => state.datatree)
    const dispatch = useDispatch()

    function onFocus() {
        getAllDataTree(retrieved_data=>{dispatch(loadDataTree(retrieved_data))})
    }

    function onChange (currentNode, selectedNodes) {
        let selected_nodes = extractNodesFromInternalIDs(selectedNodes, data)
        fetchData(data => {dispatch(setActiveFrames(data))}, getFramesIDsFromTree(selected_nodes), true)
       }

    return(
        <div className = 'DataTree'>
            <DropdownTreeSelect 
                data={data} 
                onChange={onChange}
                onFocus={onFocus} 
                keepTreeOnSearch={true} 
                showPartiallySelected={true} 
                texts={{placeholder:'Select frames...'}}/>
        </div>
    )
}

export default DataTree