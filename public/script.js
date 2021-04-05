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
  $('.modal .error').html('');
  Form.setFields();
  $('.modal #form button#submit').off('click');
  $('.modal #form button#submit').on('click', () => sendAddPessoa());
  toggleModal();
}

function editPessoa(pessoa) {
  Form.setFields(pessoa);
  $('.modal #form button#submit').off('click');
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

async function sendAddPessoa() {
  $('.modal #submit').addClass('is-loading');
  const url = `/pessoas`;
  try {
    const body = await addGithub(Form.getFields());
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (new String(res.status).startsWith('2')) {
      toggleModal();
      const content = await res.text();
      $('main').html(content);
    } else {
      const content = await res.json();
      throw new Error(content.message.join(', '));
    }
  } catch (error) {
    $('.modal #submit').removeClass('is-loading');
    createUpdateFailureFn('.modal .error', error);
  }
}

async function sendEditPessoa(id, prevLogin) {
  $('.modal #submit').addClass('is-loading');
  const url = `/pessoas/${id}`;
  let body = Form.getFields();
  try {
    if (body.login !== prevLogin) {
      body = await addGithub(body);
    }
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (new String(res.status).startsWith('2')) {
      toggleModal();
      const content = await res.text();
      $('.modal #submit').removeClass('is-loading');
      $(`.card[data-id='${id}']`).html($(content).html());
    } else {
      const content = await res.json();
      throw new Error(content.message.join(', '));
    }
  } catch (error) {
    $('.modal #submit').removeClass('is-loading');
    createUpdateFailureFn('.modal .error', error);
  }
}

async function sendRemovePessoa(id) {
  $(`.card[data-id='${id}'] #remove`).addClass('is-loading');
  const url = `/pessoas/${id}`;
  try {
    const res = await fetch(url, { method: 'DELETE' });
    const content = await res.text();
    $('main').html(content);
  } catch (error) {
    $(`.card[data-id='${id}'] #remove`).removeClass('is-loading');
    createUpdateFailureFn('main .top .error', error);
  }
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

function createUpdateFailureFn(selector, error) {
  const element = `<div class='notification is-danger'>${error}</div>`;
  $(selector).html(element);
}

// Serviços

async function fetchGithub(login) {
  const url = `https://api.github.com/search/users?q=${login}`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.items && data.items.length ? data.items[0] : undefined;
}

async function searchCep() {
  const cep = $('.modal #cep.input').val();
  try {
    if (!cep) {
      throw new Error('cep inválido');
    }
    $('#btn-cep').addClass('is-loading');
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const res = await fetch(url);
    const data = await res.json();
    $('#btn-cep').removeClass('is-loading');
    if (data.cep) {
      $(`.modal #logradouro.input`).val(data.logradouro);
      $(`.modal #bairro.input`).val(data.bairro);
      $(`.modal #localidade.input`).val(data.localidade);
      $(`.modal #uf.input`).val(data.uf);
    } else {
      throw new Error('cep inválido');
    }
  } catch (error) {
    $('#btn-cep').removeClass('is-loading');
    createUpdateFailureFn('.modal .error', error);
  }
}
