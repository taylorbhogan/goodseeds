// const db = require('../../db/models');

window.addEventListener("load", (event) => {
  // Test Add Notes
  const addNoteButton = document.querySelector('#addNoteButton')
  const noteForm = document.querySelector('#noteForm')

  if (addNoteButton){

    const addNote = async event => {
      event.preventDefault();
      const formData = new FormData(noteForm);
      const note = formData.get('note')
      const plantToShelfId = +window.location.pathname.split('/')[3]
      const res = await fetch(`/plants/personal/${plantToShelfId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note })
      })
      const data = await res.json();
      noteForm.reset();

      const noteContainer = document.querySelector('#noteContainer')
      const newNote = document.createElement('div')
      newNote.setAttribute('class','note-card')
      const noteText = document.createElement('p')
      noteText.innerText = data.text
      const noteDate = document.createElement('p')
      noteDate.innerText = data.createdAt
      newNote.append(noteText, noteDate)
      noteContainer.appendChild(newNote)
    }

    addNoteButton.addEventListener('click', addNote)
  }

  // Test Add Notes

  const commentList = document.querySelector('#addCommentButton');
  const commentForm = document.querySelector('.comment-form')
  // const signupButton = document.querySelector('#signup-button')
  // const signupForm = document.querySelector('#signup-form')

  //method to find the ID of the current shelf
  if (commentList) {
    const currentUrl = String(window.location.pathname)
    const findId = (currentUrl) => {
      for (let i = currentUrl.length - 1; i > 0; i--) {
        let currentChar = currentUrl[i]
        let index;
        if (currentChar === "/") {
          index = i;
          return currentUrl.slice(i + 1)
        }
      }
    }

    //method to grab username from nav bar
    const findUsername = (spanContent) => {
      for (let i = 0; i < spanContent.length; i++) {
        let currentChar = spanContent[i]
        let index;
        if (currentChar === " ") {
          index = i;
          return spanContent.slice(i + 1)
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
      newDivTag.innerHTML = `Written just a moment ago`;
      newPTag.appendChild(newDivTag);
    }


    //AJAX call to add a new comment without refreshing the page
    const addComment = async (event) => {
      event.preventDefault();
      const formData = new FormData(commentForm);
      const comment = formData.get('user-comment')
      const res = await fetch(`/shelves/${shelfId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment })
      })
      const data = await handleResponse(res);
      commentForm.reset();
      receiveComment(data);
    }

    //on the click of the button, adds the information in the text field, and posts it as a comment
    commentList.addEventListener('click', addComment)


    // const signUp = async (e) => {
    //   e.preventDefault()
    //   console.log('---------------inside signUp--------');
    //   const formData = new FormData(signupForm);
    //   console.log('---------------formData------------');
    //   console.log(formData);
    // }

    // signupButton.addEventListener('click', signUp)
  }
})
