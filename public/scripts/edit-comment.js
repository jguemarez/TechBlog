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
    }).then((res) => {
      if (res.ok) {
        alert("Comment was successfully updated.");
        document.location.replace('/api/dashboard/comments');
      } else {
        alert(res.statusText);
      };
    });
  } else{
    alert("The comment must include some content.");
  }
};


const delCommentHandler = async () => {
  const id = document.querySelector('.card-subtitle').textContent

  const response = await fetch(`/api/dashboard/comments/${id}/edit`, {
    method: 'DELETE',
  }).then((res) => {
    if (res.ok) {
      alert("Comment was successfully deleted.");
      document.location.replace('/api/dashboard/comments');
    } else {
      alert(res.statusText);
    }
  });
};



document
  .querySelector('#update')
  .addEventListener('click', updateCommentHandler);


document
  .querySelector('#delete')
  .addEventListener('click', delCommentHandler);

