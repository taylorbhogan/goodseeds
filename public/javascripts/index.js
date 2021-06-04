window.addEventListener("load", (event)=>{
  // const spanTag = document.querySelector(event.value)
  const deleteComment = async (event) => {
    //The tagName property returns the tag name of the element.
    // In HTML, the returned value of the tagName property is always in UPPERCASE.
    // this if statement is here to ensure that this function only fires if the user clicks on a button.
    if (event.target.tagName != 'BUTTON') return;
    const plantId = document.getElementById('shelfDelButton').parentNode.value
		// await the fetch call to the id (remember above when creating the comments we gave them an id of i, i.e. their index value within the array)
		// we pass in the number here, which the server will recognize as an 'id' value within the params, thanks to the wildcard value on the backend (see this in the delete route within index.js)
		const res = await fetch(`shelves/${event.target.id}`, { method: 'DELETE', plantId })
		// handle the response with helper function above
		const data = await handleResponse(res)
		// pass this data into the receiveComments helper function to rebuild our comments array, which will now not contain the deleted comment.
		// If you're thinking to yourself "this seems inefficient"... you're right! You'll learn more efficient ways of interacting with the DOM soon :)
		receiveComments(data)
}
})
