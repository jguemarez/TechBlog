const loginFormHandler = async (event) => {
    event.preventDefault();
  
    // Collect values from the login form
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (username && password) {
      // Send a POST request to the API endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
   
        document.location.replace('/api/dashboard');
     
      } else {
        alert("Incorrect username or password. Either try again or sign-up if you are new.");
      }
    }
  };

  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);
  
 
  