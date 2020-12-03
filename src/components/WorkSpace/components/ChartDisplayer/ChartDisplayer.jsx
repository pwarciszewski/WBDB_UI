import React, { useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { useSelector, useDispatch } from 'react-redux'
import { setFocus } from '../../../../actions'
import './ChartDisplayer.css'


const COLOR_PALETTE = ['#111d5e', '#c70039', '#f37121', '#ffbd69', '#086972', '#01a9b4', '#87dfd6', '#fbfd8a', '#184d47', '#96bb7c']

const getOptionsForAxes = (data_frames) => {
    let options = {}
    let properties = []
    let results = []

    for(const entry of data_frames){
        for(const property in entry.data.properties) {
          if(!properties.includes(property)){
            properties.push(property)
          }
        }
        for(const result in entry.data.results) {
          if(!results.includes(result) && entry.data.results[result].type === 'NUM'){
            results.push(result)
          }
        }
      }
      options['properties'] = properties
      options['results'] = results
      return options
}

const getResultStr = (result) => ('Result: ' + result)

const getPropertyStr = (property) => ('Property: ' + property)

const extractDataFromFrames = (data_frames, value_source) => {
    //value_source is a string that represents source of the data we are gathering. Usually it is a name of a server-side function that calculated given result or property for a frame.
    //As this function is used in ChartDisplayer, it assumes that the name starts with 'p' or 'r', which helps to determine if a value should be seeken in Properties or Results.

    const source_char = value_source.slice(0,1)
    const option = value_source.slice(1)

    let values = {}

    switch(source_char) {
        case 'p':
            for(const frame of data_frames) {
                try{
                    values[frame.id] = frame.data.properties[option]
                } catch(e){}
            }
        case 'r':
            for(const frame of data_frames) {
                try{
                    values[frame.id] = frame.data.results[option].value
                } catch(e){}
            }
        default: {}
    }
    return values
}

const getDataPointsFromXandY = (x_data, y_data) => {
    const data = []
    for(const point in x_data){
        if(y_data.hasOwnProperty(point)){
            let temp = {}
            temp.id = point
            temp.data = [Number(x_data[point]), Number(y_data[point])]
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

const findDiferentFramesGroups = (frames) => {
    const frames_groups = []
    for(const frame of frames) {
        if(!frames_groups.includes(frame.data.sequence_name)) {
            frames_groups.push(frame.data.sequence_name)
        }
    }
    return(frames_groups)
}

const assignColorsToIds = (data_frames) => {
    const frames_groups = findDiferentFramesGroups(data_frames)
    const group_color_assignment = {}
    for(const [i, item] of frames_groups.entries()) {
        group_color_assignment[item] = COLOR_PALETTE[i % COLOR_PALETTE.length]
    }
    const id_color_assignment = {}
    for(const frame of data_frames) {
        id_color_assignment[frame.id] = group_color_assignment[frame.data.sequence_name]
    }
    return(id_color_assignment)
}

const renderOptionsForEchartsChart = (data, xlabel, ylabel, ranges, color_assignment) => {
    let x_name = ''
    let y_name = ''

    if(xlabel[0] === 'p' || xlabel[0] ==='r'){
        x_name = xlabel.slice(1)
    }

    if(ylabel[0] === 'p' || ylabel[0] ==='r'){
        y_name = ylabel.slice(1)
    }

    const options = {
        backgroundColor: '#f4f4f4',
        tooltip: {
          trigger: 'axis',
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
            name: item.id,
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
    };
  
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


const ChartDisplayer = () => {
    const dispatch = useDispatch()
    const data_frames = useSelector(state => state.activeframes)

    const color_assignment = assignColorsToIds(data_frames)

    const [x_axis_selection, setXAxis] = useState('INIT')
    const [y_axis_selection, setYAxis] = useState('INIT')

    const avail_options = getOptionsForAxes(data_frames)

    const x_data = extractDataFromFrames(data_frames, x_axis_selection)
    const y_data = extractDataFromFrames(data_frames, y_axis_selection)

    const points = getDataPointsFromXandY(x_data, y_data)
    const ranges = getRangesForPlot(points)
    
    const events = {click: (e) => dispatch(setFocus(data_frames.find(frame => frame.id === Number(e.seriesName))))}


    return(
        <div className ='ChartDisplayer'>
            <div className = 'ChartSelector'>
                Select X:
                <select value={x_axis_selection} onChange={event=>setXAxis(event.target.value)}>
                    <option value={'INIT'}>Select values source</option>
                    {//Additional 'p' or 'r' in value is used later to determine if a source of the value is located in properties or in results of data frames
                    }
                    {avail_options.properties.map((property, index) => (<option key={'p' + String(index)} value={'p' + property}>{getPropertyStr(property)}</option>))}
                    {avail_options.results.map((result, index) => (<option key={'r' + String(index)} value={'r' + result}>{getResultStr(result)}</option>))}
                </select>
                Select Y:
                <select value={y_axis_selection} onChange={event=>setYAxis(event.target.value)}>
                    <option value={'INIT'}>Select values source</option>
                    {avail_options.properties.map((property, index) => (<option key={'p' + String(index)} value={'p' + property}>{getPropertyStr(property)}</option>))}
                    {avail_options.results.map((result, index) => (<option key={'r' + String(index)} value={'r' + result}>{getResultStr(result)}</option>))}
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