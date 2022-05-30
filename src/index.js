import Api from './apiImages';
import Notiflix from 'notiflix';
import InfiniteScroll from 'infinite-scroll';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const REFS = {
   form: document.querySelector("#search-form"),
   gallery: document.querySelector("#gallery"),
   btnMore: document.querySelector("#btnmore"),
   nextLink: document.querySelector(".pagination__next")
}

let searchQuery = '';
let page = 1;
let per_page = 12;
let all_post_results = 0;

let elem = document.querySelector('#gallery');
let infScroll = new InfiniteScroll( elem, {
  path: '.pagination__next',
  append: '.photo-card',
  history: false,
  scrollThreshold: 100,
});
infScroll.on( 'load', ()=>{
   page+=1;
   REFS.nextLink.href = `${page + 1}`;
   getAndRenderImages(searchQuery);
});

const galery = new SimpleLightbox('.gallery a');

async function getAndRenderImages(search){
   try {
      let response =  await Api.apiImages(search, page, per_page);
      let imagesArray = response.data.hits;
      all_post_results = response.data.totalHits;
      if(imagesArray.length == 0){
         throw ('Sorry, there are no images matching your search query. Please try again.');
      }else {
         renderImages(imagesArray);
         if(all_post_results <= page * per_page) {
            btnMoreHidden();
         }else {
            btnMoreView();
         }
         galery.refresh();
      }
      return response;
   }catch(error){
      Notiflix.Notify.failure(error);
   }
}

async function searchImage(e){
   e.preventDefault();
   searchQuery = e.currentTarget.elements.searchQuery.value;
   page = 1;
   claerBox();
   btnMoreHidden();
   let result = await getAndRenderImages(searchQuery);
   if(result){
      Notiflix.Notify.warning(`Всего ${all_post_results}`);
   }
}

function claerBox(){
   REFS.gallery.innerHTML = "";
}

function renderImages(imageArray){
   let result = "";
   imageArray.map( element => {
      result += `
      <a href="${element.webformatURL}" class="photo-card">
      <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${element.downloads}
        </p>
      </div>
    </a>
      `;
   });
   REFS.gallery.insertAdjacentHTML("beforeend", result);
}

function btnMoreView(){
   REFS.btnMore.classList.remove("close");
}

function btnMoreHidden(){
   REFS.btnMore.classList.add("close");
}

async function btnMoreClick(e){
   page+= 1;
   await getAndRenderImages(searchQuery);
   scrollAnim();
}

function scrollAnim(){
   const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
   
   window.scrollBy({
   top: cardHeight * 2,
   behavior: "smooth",
   });
}

REFS.form.addEventListener("submit", searchImage);
REFS.btnMore.addEventListener("click", btnMoreClick)
