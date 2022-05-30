import Axios from 'axios';

const APILINK = 'https://pixabay.com/api/';
const APIMYKEY = '26261664-8c9b2a800fec54bf4b5302558';

function apiImages(search, page, per_page){
   return Axios.get(`${APILINK}?key=${APIMYKEY}&q=${search}&page=${page}&per_page=${per_page}`);
}

export default {
   apiImages
}