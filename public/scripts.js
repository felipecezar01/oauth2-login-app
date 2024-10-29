document.addEventListener('DOMContentLoaded', () => {
    // Captura o formulário de registro
    const registerForm = document.getElementById('registerFormElement');
    const loginForm = document.getElementById('loginFormElement');
  
    // Verifica se o formulário de registro existe na página
    if (registerForm) {
      registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const username = registerForm.querySelector('input[name="username"]').value;
        const email = registerForm.querySelector('input[name="email"]').value;
        const password = registerForm.querySelector('input[name="password"]').value;
  
        if (!username || !email || !password) {
          alert('Todos os campos são obrigatórios!');
          return;
        }
  
        try {
          const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
          });
  
          if (response.redirected) {
            // Redireciona para a página de boas-vindas se o servidor enviar o redirecionamento
            window.location.href = response.url;
          } else {
            const result = await response.json();
            alert(result.message); // Exibe uma mensagem de sucesso ou erro
          }
        } catch (error) {
          console.error('Erro ao registrar:', error);
          alert('Erro ao registrar. Verifique o console para mais detalhes.');
        }
      });
    }
  
    // Verifica se o formulário de login existe na página
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const email = loginForm.querySelector('input[name="email"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;
  
        if (!email || !password) {
          alert('Email e senha são obrigatórios!');
          return;
        }
  
        try {
          const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
  
          if (response.redirected) {
            window.location.href = response.url;
          } else {
            const result = await response.json();
            alert(result.message);
          }
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          alert('Erro ao fazer login. Verifique o console para mais detalhes.');
        }
      });
    }
  });
  