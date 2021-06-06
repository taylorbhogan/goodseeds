// const db = require('../../db/models');

window.addEventListener("load", (event)=>{
  const commentList = document.querySelector('#addCommentButton');
  const commentForm = document.querySelector('.comment-form')


  // const spanTag = document.querySelector(event.value)
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

// m
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


//   //Deletes a single plant from a user's shelf
//   const deletePlantOnShelf = async (event) => {
//     //The tagName property returns the tag name of the element.
//     // In HTML, the returned value of the tagName property is always in UPPERCASE.
//     // this if statement is here to ensure that this function only fires if the user clicks on a button.
//     if (event.target.tagName != 'BUTTON') return;
// 	// await the fetch call to the id (remember above when creating the comments we gave them an id of i, i.e. their index value within the array)
// 	// we pass in the number here, which the server will recognize as an 'id' value within the params, thanks to the wildcard value on the backend (see this in the delete route within index.js)
// 	const res = await fetch(`/shelves/planttoshelf/${event.target.id}`, {method: 'DELETE'})
// 	// // handle the response with helper function above
// 	const data = await res.json()
// 	// // pass this data into the receiveComments helper function to rebuild our comments array, which will now not contain the deleted comment.
// 	// // If you're thinking to yourself "this seems inefficient"... you're right! You'll learn more efficient ways of interacting with the DOM soon :)
// 	// receiveComments(data)
// }

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
    // newSpanTag.innerHTML = `On ${today.toUTCString()}-0400 (Eastern Daylight Time) `
    // newPTag.appendChild(newSpanTag);
    // const newATag = document.createElement('a');
    // newATag.setAttribute('href', `/users/${data.userId}/shelves`)
    // newATag.innerHTML = username;
    // newPTag.appendChild(newATag);
    // const secondSpanTag = document.createElement('span');
    // secondSpanTag.innerHTML = ' wrote: '
    // newPTag.appendChild(secondSpanTag);
    // const lastPTag = document.createElement('p');
    // lastPTag.innerHTML = data.commentText;
    // newCommentContainer.appendChild(lastPTag);
  }



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
    // try {
    //   const res = await fetch(`http://localhost:8080/shelves/${shelfId}`,{
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({comment})
    //   })
    //   const data = await handleResponse(res);
    //   commentForm.reset();
    //   receiveComment(data);
    //   // console.log("DATA--TAYLOR",data);
    //   }
    //   catch (e) {
    //     console.log("I AM THE ERROR TAYLOR", e);
    //   }
  }
  // Delete Plant Button Click
  // const list = document.querySelectorAll('.plant-card')
  // console.log(list);
  // for(let i = 0; i < list.length; i++) {
	//   list[i].addEventListener('click', deletePlantOnShelf);
  // }

  // const commentList = document.querySelector('#addCommentButton');
  // const commentForm = document.querySelector('.comment-form')
  commentList.addEventListener('click', addComment)


})
