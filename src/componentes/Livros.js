import React, { Component } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';

export class Livros extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      titulo: '',
      autor: '',
      editora: '',
      modalAberta: false,
      livros: []
    };
  }

  componentDidMount() {
    this.listarLivros();
  }

  listarLivros() {
    fetch('/livros/')
      .then(resposta => resposta.json())
      .then(dados => this.setState({ livros: dados }))
      .catch(console.error);
  }

  buscarLivro(id) {
    fetch(`/livros/${id}`)
      .then(resposta => resposta.json())
      .then(dados => this.setState({
        id: dados.id,
        titulo: dados.titulo,
        autor: dados.autor,
        editora: dados.editora
      }))
      .catch(console.error);
  }

  cadastrarLivro() {
    const { titulo, autor, editora } = this.state;
    const livro = { titulo, autor, editora };

    fetch('/livros/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro)
    }).then(resposta => {
      if (resposta.ok) {
        this.listarLivros();
        this.fecharModal();
      } else {
        alert('Erro ao cadastrar o livro');
      }
    }).catch(console.error);
  }

  atualizarLivro() {
    const { id, titulo, autor, editora } = this.state;

    if (!id) {
      alert('ID do livro não encontrado');
      return;
    }

    const livro = { id, titulo, autor, editora };

    fetch(`/livros/${livro.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro)
    }).then(resposta => {
      if (resposta.ok) {
        this.listarLivros();
        this.fecharModal();
      } else {
        alert('Erro ao atualizar o livro');
      }
    }).catch(console.error);
  }

  excluirLivro(id) {
    fetch(`/livros/${id}`, {
      method: 'DELETE',
    })
    .then(resposta => {
      if (resposta.ok) {
        this.listarLivros();
      } else {
        alert('Erro ao excluir o livro');
      }
    })
    .catch(console.error);
  }

  atualizaCampo = (campo) => (e) => {
    this.setState({ [campo]: e.target.value });
  }

  abrirModalInserir = () => {
    this.setState({ modalAberta: true, id: null, titulo: '', autor: '', editora: '' });
  }

  abrirModalAtualizar = (id) => {
    this.setState({ modalAberta: true });
    this.buscarLivro(id);
  }

  fecharModal = () => {
    this.setState({ id: null, titulo: '', autor: '', editora: '', modalAberta: false });
  }

  submit = () => {
    this.state.id ? this.atualizarLivro() : this.cadastrarLivro();
  }

  renderModal() {
    return (
      <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Preencha os dados do livro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="modalForm" onSubmit={e => { e.preventDefault(); this.submit(); }}>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control type='text' placeholder='Título' value={this.state.titulo} onChange={this.atualizaCampo('titulo')} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Autor</Form.Label>
              <Form.Control type='text' placeholder='Autor' value={this.state.autor} onChange={this.atualizaCampo('autor')} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Editora</Form.Label>
              <Form.Control type='text' placeholder='Editora' value={this.state.editora} onChange={this.atualizaCampo('editora')} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.fecharModal}>Cancelar</Button>
          <Button variant="primary" type="submit" form="modalForm">Confirmar</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderTabela() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Editora</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {this.state.livros.map(livro => (
            <tr key={livro.id}>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.editora}</td>
              <td>
                <Button className="btn btn-info" onClick={() => this.abrirModalAtualizar(livro.id)}>Editar</Button>
                <Button className="btn btn-danger" onClick={() => this.excluirLivro(livro.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <div>
        <Button variant="primary" onClick={this.abrirModalInserir}>Adicionar Livro</Button>
        {this.renderTabela()}
        {this.renderModal()}
      </div>
    );
  }
}

export default Livros;
