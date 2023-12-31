const addCommentHandler = async (event) => {

  event.preventDefault();
  const id = document.querySelector('.card-subtitle').textContent
  const content = document.querySelector('#comment-area').value.trim();

  let response;
  if (content) {
    response = await fetch(`/api/dashboard/posts/${id}/comment`, {
      method: 'POST',
      body: JSON.stringify({ blog_post_id: id, content }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.ok) {
        alert("Comment added!");
      } else {
        alert(res.statusText);
      }
    });
  } else {
    alert('You need to add some content to your comment!');
  }
};

document.querySelector('#add-comment').addEventListener('click', addCommentHandler);