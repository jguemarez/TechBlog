const updateCommentHandler = async () => {
  const id = document.querySelector('.card-subtitle').textContent
  const content = document.querySelector('#comment-content').value.trim();


  if (content) {
    const response = await fetch(`/api/dashboard/comments/${id}/edit`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
      if (response.ok) {
        alert('Comment was successfully updated.');
        return;
      } else {
        alert(response.statusText);
        return;
      };
  } else{
    alert("The comment must include some content.");
  }
};


const delCommentHandler = async () => {
  const id = document.querySelector('.card-subtitle').textContent

  const response = await fetch(`/api/dashboard/comments/${id}/edit`, {
    method: 'DELETE',
  });
    if (response.ok) {
      alert('Comment was successfully deleted.') ;
      return;
    } else {
      alert(response.statusText);
      return;
    };
};



document
  .querySelector('#update')
  .addEventListener('click', updateCommentHandler);


document
  .querySelector('#delete')
  .addEventListener('click', delCommentHandler);

