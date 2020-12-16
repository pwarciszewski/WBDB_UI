import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactEcharts from 'echarts-for-react'
import { readRemoteFile } from 'react-papaparse'
import './CSVDisplayer.css'
import { SERVER_IP_IMG } from '../../../../api'


const renderEchartsOptions = (data_list) => {
    const rendered_options = {
        backgroundColor: '#f4f4f4',
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'value'
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none',
                    title: {
                        zoom: 'Zoom',
                        back: 'Back'
                    }
                    
                },
                restore: {
                    title: 'Restore'
                },
                saveAsImage: {
                    title: 'Save as Image'
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        series: []
    }
 
    for(const data of data_list){
        rendered_options.series.push({
            type: 'line',
            showSymbol: false,
            data: data
        })
    }

    return(rendered_options)
}

const loadManyCSVFiles = (url_list, callback_function, final_data_list = []) => {
    if(url_list.length > 0) {
        const file_path = url_list[0]
        url_list.shift()
        readRemoteFile(SERVER_IP_IMG + file_path, {
            download: true,
            complete: (results) => {
                loadManyCSVFiles(url_list, callback_function, [...final_data_list, results.data])
            }
        })
    }
    else {
        if(final_data_list.length > 0) {
            callback_function(final_data_list)
        }
        else {
            callback_function([])
        }
    }
}


const findAvailableDevices = (frames_list) => {
    let devices_names_list = []
    for(let iteration of frames_list) {
        for(let frame of iteration.data_frames) {
            let temp_name = frame.data.data_source
            if(!devices_names_list.includes(temp_name)) {
                devices_names_list.push(temp_name)
            }
        }
    }
    return(devices_names_list)
}


const findAvailableCSVResults = (device_name, frames_list) => {
    let results_names_list = []
    for(let iteration of frames_list) {
        for(let frame of iteration.data_frames) {
            for(let result in frame.data.results) {
                if(frame.data.results[result].type === 'CSV' && frame.data.data_source === device_name) {
                    if(! results_names_list.includes(result)){
                        results_names_list.push(result)
                    }
                }
            }
        }
    }
    return(results_names_list)
}


const findCSVurls = (selected_device, selected_result, frames_list, only_focussed) => {
    const csv_urls_list = []
    if(selected_device !== 'INIT' && selected_result !== 'INIT' && frames_list.length > 0) {
        if(only_focussed){
            let url = ''
            try{
                url = frames_list.find(iter => iter.focussed === true).data_frames
                .find(frame => frame.data.data_source === selected_device)
                .data.results[selected_result].value
            } catch {
                url = undefined
            }

            if(url !== undefined) {
                csv_urls_list.push(url)
            }
        } else {
            for(const iter of frames_list){
                let url = ''
                try {
                    const frame_from_the_device = iter.data_frames.find(frame => frame.data.data_source === selected_device)
                    url = frame_from_the_device.data.results[selected_result].value
                } catch {
                    url = undefined
                }
                if(url !== undefined) {
                    csv_urls_list.push(url)
                }
            }
        }
    }

    return(csv_urls_list)
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
    for(const data_set of points) {
        for(const point of data_set) {
            extracted_data_points.push(point)
        }
    }
    exportToCsv(filename, extracted_data_points)
} 

const CSVDisplayer = () => {
    const active_iterations = useSelector(state => state.activeframes)

    const [display_focussed, setDisplayFocussed] = useState(true)

    const [selected_device, setSelectedDevice] = useState('INIT')
    const [selected_result, setSelectedResult] = useState('INIT')
    const available_devices = findAvailableDevices(active_iterations)
    const available_CSV_results = findAvailableCSVResults(selected_device, active_iterations)

    const selected_traces_urls = findCSVurls(selected_device, selected_result, active_iterations, display_focussed)
    
    const [selected_traces, setSelectedTraces] = useState([])
    
    useEffect(() => loadManyCSVFiles(selected_traces_urls, setSelectedTraces), [selected_device, selected_result, active_iterations, display_focussed])
    

    //REMEMBER ABOUT notMerge={true} in ReactsEcharts, otherwise many plots may be unintentionally present
    // discoused here : https://github.com/apache/incubator-echarts/issues/6202
    return(
        <div className = 'CSVDisplayer'>
            <div className = 'CSVSelector'>
                <select  value={selected_device} onChange={event=>setSelectedDevice(event.target.value)}>
                    <option value={'INIT'}>Select device</option>
                    {available_devices.map((device, index) => (<option key={index} value={device}>{device}</option>))}
                </select>
                <select  value={selected_result} onChange={event=>setSelectedResult(event.target.value)}>
                    <option value={'INIT'}>Select result to show</option>
                    {available_CSV_results.map((result, index) => (<option key={index} value={result}>{result}</option>))}
                </select>
                Display only focussed:
                <input type="checkbox" defaultChecked={display_focussed} onChange={() => setDisplayFocussed(!display_focussed)} />
                <button onClick={() => handleCsvDownload('result.csv', selected_traces)}>Download</button>
            </div>

            <ReactEcharts option={renderEchartsOptions(selected_traces)} 
                          notMerge={true}
                          style={{
                            height: 'calc(100% - 30px)',
                            width: '100%',
                          }}/>

        </div>)
}


export default CSVDisplayer