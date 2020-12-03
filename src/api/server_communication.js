export const SERVER_IP = 'http://127.0.0.1:8000/DataBrowse'
export const SERVER_IP_IMG = 'http://127.0.0.1:8000'


//export const SERVER_IP = '/DataBrowse'
//export const SERVER_IP_IMG = ''


function utilGenerateURIQuery(data) {
    let esc = encodeURIComponent
    let query = Object.keys(data)
        .map(k => esc(k) + '=' + esc(data[k]))
        .join('&')
    return(query)
  }

async function postData(url = '', data = {}) {
    // taken from MDN site
    // Default options are marked with * 
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export function getAllDataTree(wrapped_action) {
    fetch(SERVER_IP + '/getdatatree/')
        .then(response => response.json())
        .then(data => { wrapped_action(data) })
        .catch(err => console.log(err))
}

export function getNewestID(wrapped_action) {
    fetch(SERVER_IP + '/getnewestid/')
        .then(response => response.json())
        .then(data => { wrapped_action(data)})
        .catch(err => console.log(err))
}

export function fetchData(wrapped_action, selected_frames) {
    postData(SERVER_IP + '/fetchdata/', {'selected': selected_frames})
        .then(data => {wrapped_action(data);console.log(data)})
        .catch(err => console.log(err))
}

export function fetchImg(wrapped_action, img_url) {
    fetch(SERVER_IP_IMG + img_url)
        .then(response => response.blob())
        .then(images => {wrapped_action(URL.createObjectURL(images))})
        .catch(err => console.log(err))
}

export function fetchOps(wrapped_action) {
    fetch(SERVER_IP + '/fetchOps/')
        .then(response => response.json())
        .then(data => { wrapped_action(data) })
        .catch(err => console.log(err))
}

export function dispatchOperation(ids_list, parameters, operation, add_log_action, update_results_action) {
    add_log_action('Starting ' + operation + '...')
    postData(SERVER_IP + '/do/', {'selected': ids_list, 'parameters': parameters, 'operation':operation})
        .then(response => add_log_action(response))
        .then(() => fetchData(update_results_action, ids_list))
        .catch(err => console.log(err))
}

export function fetchRoutine(wrapped_action) {
    fetch(SERVER_IP + '/fetchRoutine/')
        .then(response => response.json())
        .then(data => wrapped_action(data))
        .catch(err => console.log(err))
}

export function uploadNewRoutine(new_routine, add_log_action) {
    postData(SERVER_IP + '/setRoutine/', {'new_routine': new_routine})
        .then(() => add_log_action('Routine updated'))
        .catch(err => console.log(err))
}
