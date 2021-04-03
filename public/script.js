/* eslint-disable @typescript-eslint/no-unused-vars */

// View

class Form {
  static getFields() {
    return {
      nome: $('.modal #nome.input').val(),
      idade: $('.modal #idade.input').val(),
      login: $('.modal #login.input').val(),
      cep: $('.modal #cep.input').val(),
      logradouro: $('.modal #logradouro.input').val(),
      numero: $('.modal #numero.input').val(),
      complemento: $('.modal #complemento.input').val(),
      bairro: $('.modal #bairro.input').val(),
      localidade: $('.modal #localidade.input').val(),
      uf: $('.modal #uf.input').val(),
    };
  }

  static setFields(pessoa) {
    if (pessoa) {
      for (const prop in pessoa) {
        const value = pessoa[prop];
        $(`.modal #${prop}.input`).val(value);
      }
    } else {
      $('.modal #form .input').val('');
    }
  }
}

function addPessoa() {
  Form.setFields();
  $('.modal #form button#submit').off('click');
  $('.modal #form button#submit').on('click', toggleModal);
  $('.modal #form button#submit').on('click', () => sendAddPessoa());
  toggleModal();
}

function editPessoa(pessoa) {
  Form.setFields(pessoa);
  $('.modal #form button#submit').off('click');
  $('.modal #form button#submit').on('click', toggleModal);
  $('.modal #form button#submit').on('click', () =>
    sendEditPessoa(pessoa._id, pessoa.login),
  );
  toggleModal();
}

function toggleModal() {
  $('.modal').toggleClass('is-active');
  $('html').toggleClass('is-clipped');
}

// API

async function fetchAndUpdate(method, url, body, updateFn) {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method,
      body,
    });
    const content = await res.text();
    updateFn(content);
  } catch (error) {
    console.log(error);
  }
}

async function sendAddPessoa() {
  const url = `/pessoas`;
  const body = await addGithub(Form.getFields());
  fetchAndUpdate('POST', url, JSON.stringify(body), (content) =>
    $('main').html(content),
  );
}

async function sendEditPessoa(id, prevLogin) {
  const url = `/pessoas/${id}`;
  let body = Form.getFields();
  if (body.login !== prevLogin) {
    body = await addGithub(body);
  }
  fetchAndUpdate('PUT', url, JSON.stringify(body), (content) =>
    $(`.card[data-id='${id}']`).html($(content).html()),
  );
}

function sendRemovePessoa(id) {
  const url = `/pessoas/${id}`;
  fetchAndUpdate('DELETE', url, undefined, (content) =>
    $('main').html(content),
  );
}

async function addGithub(body) {
  const res = Object.assign({}, body);
  if (body.login) {
    const github = await fetchGithub(body.login);
    // Usar dados caso encontrado nome de usuário
    if (github && github.login === body.login) {
      ['avatar_url', 'html_url', 'score'].forEach((prop) => {
        res[prop] = github[prop];
      });
    }
  }
  return res;
}

// Serviços

async function fetchGithub(login) {
  const url = `https://api.github.com/search/users?q=${login}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data?.items && data.items.length ? data.items[0] : undefined;
  } catch (error) {
    console.log(error);
  }
}

async function searchCep() {
  const cep = $('.modal #cep.input').val();
  if (cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cep) {
        $(`.modal #logradouro.input`).val(data.logradouro);
        $(`.modal #bairro.input`).val(data.bairro);
        $(`.modal #localidade.input`).val(data.localidade);
        $(`.modal #uf.input`).val(data.uf);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
