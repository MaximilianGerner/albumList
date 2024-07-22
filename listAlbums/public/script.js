function nextPage() {
  console.log(page);

  page++;


  // access new page from server
  //getResults();
  window.location.replace("localhost:8000?page=" + page);
}

function previousPage() {
  if (page > 1) {  
    page--;


  }
}

