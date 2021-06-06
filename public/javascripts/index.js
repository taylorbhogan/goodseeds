// const db = require('../../db/models');

window.addEventListener("load", (event)=>{
  const commentList = document.querySelector('#addCommentButton');
  const commentForm = document.querySelector('.comment-form')


  //method to find the ID of the current shelf
  const currentUrl = String(window.location.pathname)
  const findId = (currentUrl) => {
    for(let i = currentUrl.length-1; i > 0; i--){
      let currentChar = currentUrl[i]
      let index;
      if(currentChar === "/"){
        index = i;
        return currentUrl.slice(i+1)
      }
    }
  }

  //method to grab username from nav bar
  const findUsername = (spanContent) => {
      for(let i = 0; i < spanContent.length; i++){
        let currentChar = spanContent[i]
        let index;
        if(currentChar === " "){
          index = i;
          return spanContent.slice(i+1)
        }
      }
  }

  // const rightNavSpan = document.querySelector('.spanTag')
  // const spanContent = rightNavSpan.textContent;
  // const spanContent = "this is the spanContent variable"


  const rightNavSpan = document.querySelector('#dom-username-source')
  const spanContent = rightNavSpan.textContent;

  //handles all the responses for our comments
  const handleResponse = async (res) => {
    const data = await res.json()
    return data
  }

  const shelfId = findId(currentUrl);


  // const grabUser = async(data) => {
  //   const user = await db.User.findByPk(data.userId)
  //   return user.username
  // }


//displays all current comments for a shelf
  const receiveComment = (data) => {
    const comments = document.querySelector('.comment-list-container')

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed)

    const username = findUsername(spanContent);

    const newCommentContainer = document.createElement('div');
    comments.appendChild(newCommentContainer)
    newCommentContainer.className = 'comment-div';
    const newPTag = document.createElement('p');
    newCommentContainer.appendChild(newPTag);
    const newATag = document.createElement('a');
    newATag.setAttribute('href', `/users/${data.userId}/shelves`)
    newATag.innerHTML = username;
    newPTag.appendChild(newATag);
    const newSpanTag = document.createElement('span');
    newSpanTag.innerHTML = ' wrote:'
    newPTag.appendChild(newSpanTag);
    const lastPTag = document.createElement('p');
    lastPTag.innerHTML = data.commentText;
    newPTag.appendChild(lastPTag);
    const newDivTag = document.createElement('div');
    newDivTag.innerHTML = `Written on ${today.toUTCString()}`;
    newPTag.appendChild(newDivTag);
  }


//AJAX call to add a new comment without refreshing the page
  const addComment = async(event) => {
    event.preventDefault();
    const formData = new FormData(commentForm);
    const comment = formData.get('user-comment')
    const res = await fetch(`http://localhost:8080/shelves/${shelfId}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({comment})
    })
    const data = await handleResponse(res);
    commentForm.reset();
    receiveComment(data);
  }

  //on the click of the button, adds the information in the text field, and posts it as a comment
  commentList.addEventListener('click', addComment)


})
