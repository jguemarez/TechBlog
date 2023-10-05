const logoutHandler = async () => {
    const response = await fetch('/api/logout', {
      method: 'GET'
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  };
  
  document.querySelector('#logout').addEventListener('click', logoutHandler);
  