import axios from 'axios';
const url = "https://node.1croreads.com/"
//const url = "http://localhost:4000/"

const Get = async (apiUrl, id = '') => {
    let headers = {
        // 'Authorization': localStorage.getItem("Token"),
        // 'lang': localStorage.getItem("Language")
    }
    let APIURL;
    if (id) {
        APIURL = `${url}${apiUrl}${id}`;
    } else {
        APIURL = `${url}${apiUrl}`;     
    }
    try {
        const res = await axios.get(APIURL, { headers }); 
        return res;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            return error.request;
        } else {
            return error.message;
        }
    }
};

// const Put = async (apiUrl, data = "") => {
//     let headers = {
//         'Authorization': localStorage.getItem("Token"),
//         'lang': localStorage.getItem("Language")
//     }
//     let APIURL = `${url}${apiUrl}`;
//     try {
//         const res = await axios.put(APIURL, data, headers);
//         return res
//     } catch (error) {
//         if (error.response) {
//             // Request made but the server responded with an error
//             return error.response;
//         } else if (error.request) {
//             // Request made but no response is received from the server.
//             return error.request;
//         } else {
//             // Error occured while setting up the request
//             return error.message;
//         }
//     }
// };

const Post = async (apiUrl, data, id = '') => {
    let headers = {
        // "Content-type": "applicatizon/json",
        // 'Authorization': localStorage.getItem("Token"),
    }
    let APIURL;
    if (id) {
        APIURL = `${url}${apiUrl}${id}`;
    } else {
        APIURL = `${url}${apiUrl}`;
    }
    try {
        const res = await axios.post(APIURL, data, { headers });
        return res
    } catch (error) {
        if (error.response) {
            // Request made but the server responded with an error
            return error.response;
        } else if (error.request) {
            // Request made but no response is received from the server.
            return error.request;
        } else {
            // Error occured while setting up the request
            return error.message;
        }
    }
};


export default {
    Get,
    // Put,
    Post
}
