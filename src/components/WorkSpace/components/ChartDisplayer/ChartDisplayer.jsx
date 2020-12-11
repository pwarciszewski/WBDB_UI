import React, { useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { useSelector, useDispatch } from 'react-redux'
import { setFocus } from '../../../../actions'
import './ChartDisplayer.css'


const COLOR_PALETTE = ['#111d5e', '#c70039', '#f37121', '#ffbd69', '#086972', '#01a9b4', '#87dfd6', '#fbfd8a', '#184d47', '#96bb7c']

const compareArrays = (array1, array2) => {
    // if the other array is a falsy value, return
    if (!array2 || !array1)
        return false;

    // compare lengths - can save a lot of time 
    if (array1.length != array2.length)
        return false;

    for (var i = 0, l=array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (compareArrays(!array1[i],(array2[i])))
                return false;       
        }           
        else if (array1[i] != array2[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}


const getOptionsForAxes = (iteration_list) => {
    let options = {}
    let properties = []
    let results = []

    for(const iteration of iteration_list){
        for(const entry of iteration.data_frames){
            for(const property in entry.data.properties) {  
                const obj = [entry.data.data_source, property, 'property']
                if(!properties.some(el => compareArrays(el, obj))){
                  properties.push(obj)
                }
              }
            for(const result in entry.data.results) {
                const obj = [entry.data.data_source, result, 'result']
                if(!results.some(el => compareArrays(el, obj)) && entry.data.results[result].type === 'NUM'){
                  results.push(obj)
                }
            }
        }
      }
      options['properties'] = properties
      options['results'] = results
      return options
}

const getResultStr = (result) => (result[0] +' result: ' + result[1])

const getPropertyStr = (property) => (property[0] +' property: ' + property[1])

const extractDataFromFrames = (data_frames, raw_value_source) => {
    let values = {}
    if(raw_value_source !== 'INIT'){
        const value_source = JSON.parse(raw_value_source)
        const data_source = value_source[0]
        const option = value_source[1]
        const option_type = value_source[2]
    
    
        switch(option_type) {
            case 'property':
                for(const iteration of data_frames)
                    for(const frame of iteration.data_frames) {
                        try{
                            if(frame.data.data_source === data_source){
                                values[frame.id] = [frame.data.properties[option], frame.data.iter_token]
                            }
                        } catch(e){}
                    }
            case 'result':
                for(const iteration of data_frames)
                    for(const frame of iteration.data_frames) {
                        try{
                            if(frame.data.data_source === data_source){
                                values[frame.id] = [frame.data.results[option].value, frame.data.iter_token]
                            }
                        } catch(e){}
                    }
            default: {}
        }
    }
    return values
}

const getDataPointsFromXandY = (x_data, y_data) => {
    const data = []
    for(const point in x_data){
        if(y_data.hasOwnProperty(point)){
            let temp = {}
            temp.id = point
            temp.data = [Number(x_data[point][0]), Number(y_data[point][0])]
            temp.iter_token = x_data[point][1]
            data.push(temp)
        }
      }
    return data
}

const getRangesForPlot = (data_points) => {
    const values_x = data_points.map(el => el.data[0])
    const values_y = data_points.map(el => el.data[1])
    const min_x = Math.min.apply(null, values_x)
    const max_x = Math.max.apply(null, values_x)
    const min_y = Math.min.apply(null, values_y)
    const max_y = Math.max.apply(null, values_y)
    const range_x = max_x - min_x
    const range_y = max_y - min_y
    
    return({'min_x':min_x - 0.05*range_x, 'max_x':max_x + 0.05*range_x, 'min_y':min_y - 0.05*range_y, 'max_y':max_y + 0.05*range_y})
}

const findDiferentFramesGroups = (frames_in_iterations) => {
    const frames_groups = []
    for(const iteration of frames_in_iterations) {
        if(!frames_groups.includes(iteration.data_frames[0].data.sequence_name)) {
            frames_groups.push(iteration.data_frames[0].data.sequence_name)
        }
    }
    return(frames_groups)
}

const assignColorsToIterations = (iterations_list) => {
    const frames_groups = findDiferentFramesGroups(iterations_list)
    const group_color_assignment = {}
    for(const [i, item] of frames_groups.entries()) {
        group_color_assignment[item] = COLOR_PALETTE[i % COLOR_PALETTE.length]
    }
    const id_color_assignment = {}
    for(const iteration of iterations_list){
        for(const frame of iteration.data_frames) {
            id_color_assignment[frame.id] = group_color_assignment[frame.data.sequence_name]
        }
    }

    return(id_color_assignment)
}

const renderOptionsForEchartsChart = (data, xlabel, ylabel, ranges, color_assignment) => {
    let x_name = ''
    let y_name = ''

    if(xlabel !== 'INIT'){
        const xlabel_parsed = JSON.parse(xlabel)
        x_name = xlabel_parsed[0] + ': ' + xlabel_parsed[1]
    }

    if(ylabel !== 'INIT'){
        const ylabel_parsed = JSON.parse(ylabel)
        y_name = ylabel_parsed[0] + ': ' + ylabel_parsed[1]
    }

    const options = {
        backgroundColor: '#f4f4f4',
        tooltip: {
          trigger: 'axis',
          showContent: false,
          axisPointer: {
              type: 'cross'
          }
        },
        xAxis: {
            min: ranges.min_x,
            max: ranges.max_x,
            name: x_name,
            nameLocation: 'center',
          type: 'value',
          splitLine: {
              lineStyle: {
                  type: 'dashed'
              }
          },
        },
        yAxis: {
            min: ranges.min_y,
            max: ranges.max_y,
            name: y_name,
          type: 'value',
          splitLine: {
              lineStyle: {
                  type: 'dashed'
              }
          }
        },
        series: []
    }

    for(const item of data) {
        options.series.push({
            name: item.iter_token,
            data: [item.data],
            type: 'scatter',
            color: color_assignment[item.id],
            emphasis: {
                label: {
                    show: true,
                    position: 'left',
                    color: 'black',
                    fontSize: 16
                }
            }
        })
    }

    return options
}
// SAVE AS CSV FUNCTIONS //
const exportToCsv =(filename, rows) => {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    }
  
    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }
  
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

const handleCsvDownload = (filename, points) => {
    const extracted_data_points = []
    for(const point of points) {
        extracted_data_points.push(point.data)
    }
    exportToCsv(filename, extracted_data_points)
} 
//////

const ChartDisplayer = () => {
    const dispatch = useDispatch()
    const data_frames = useSelector(state => state.activeframes)

    const color_assignment = assignColorsToIterations(data_frames)

    const [x_axis_selection, setXAxis] = useState('INIT')
    const [y_axis_selection, setYAxis] = useState('INIT')

    const avail_options = getOptionsForAxes(data_frames)

    const x_data = extractDataFromFrames(data_frames, x_axis_selection)
    const y_data = extractDataFromFrames(data_frames, y_axis_selection)

    const points = getDataPointsFromXandY(x_data, y_data)
    const ranges = getRangesForPlot(points)
    
    const events = {click: (e) => dispatch(setFocus(data_frames.find(frame => frame.iter_token === e.seriesName)))}


    return(
        <div className ='ChartDisplayer'>
            <div className = 'ChartSelector'>
                Select X:
                <select value={x_axis_selection} onChange={event=>setXAxis(event.target.value)}>
                    <option value={'INIT'}>Select values source</option>
                    {avail_options.properties.map((property, index) => (<option key={'p' + String(index)} 
                                                                                value={JSON.stringify(property)}>
                                                                                    {getPropertyStr(property)}</option>))}
                    {avail_options.results.map((result, index) => (<option key={'r' + String(index)} 
                                                                           value={JSON.stringify(result)}>
                                                                               {getResultStr(result)}</option>))}
                </select>
                Select Y:
                <select value={y_axis_selection} onChange={event=>setYAxis(event.target.value)}>
                    <option value={'INIT'}>Select values source</option>
                    {avail_options.properties.map((property, index) => (<option key={'p' + String(index)} 
                                                                                value={JSON.stringify(property)}>
                                                                                    {getPropertyStr(property)}</option>))}
                    {avail_options.results.map((result, index) => (<option key={'r' + String(index)} 
                                                                           value={JSON.stringify(result)}>
                                                                               {getResultStr(result)}</option>))}
                </select>
                <button onClick={() => handleCsvDownload('result.csv', points)}>Download</button>
            </div>

                <ReactEcharts option={renderOptionsForEchartsChart(points, x_axis_selection, y_axis_selection, ranges, color_assignment)} 
                              onEvents={events}
                              style={{
                                height: 'calc(100% - 30px)',
                                width: '100%',
                              }}/>

        </div>
    )
}

export default ChartDisplayer