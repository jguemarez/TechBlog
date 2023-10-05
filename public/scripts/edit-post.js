const updatePostHandler = async () => {
  const id = document.querySelector('.card-subtitle').textContent
  const title = document.querySelector('#post-title').value.trim();
  const content = document.querySelector('#post-content').value.trim();


  if (title && content) {
    const response = await fetch(`/api/dashboard/${id}/edit`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/api/dashboard');
    } else {
      alert(response.statusText);
    }
  }
};


const delPostHandler = async () => {
  const id = document.querySelector('.card-subtitle').textContent

  const response = await fetch(`/api/dashboard/${id}/edit`, {
    method: 'DELETE',
  });

  if (response.ok) {
    document.location.replace('/api/dashboard');
  } else {
    alert(response.statusText);
  }
};

document
  .querySelector('#update')
  .addEventListener('click', updatePostHandler);


document
  .querySelector('#delete')
  .addEventListener('click', delPostHandler);

