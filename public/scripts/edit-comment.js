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
        document.location.replace('/api/dashboard/comments');
      } else {
        alert(response.statusText);
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
      document.location.replace('/api/dashboard/comments');
    } else {
      alert(response.statusText);
    }
};



document
  .querySelector('#update')
  .addEventListener('click', updateCommentHandler);


document
  .querySelector('#delete')
  .addEventListener('click', delCommentHandler);

