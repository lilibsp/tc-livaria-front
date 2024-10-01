import React, { Component } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import './Livros.css';

export class Livros extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      titulo: '',
      autor: '',
      editora: '',
      modalTipo: null,
      livros: [],
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

  buscarLivro(_id) {   //para a edição
    fetch(`/livros/${_id}`)
      .then(resposta => resposta.json())
      .then(dados => this.setState({
        _id: dados._id,
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
    const { _id, titulo, autor, editora } = this.state;

    if (!_id) {
      alert('ID do livro não encontrado');
      return;
    }

    const livro = { _id, titulo, autor, editora };

    fetch(`/livros/${livro._id}`, {
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

  excluirLivro(_id) {
    if (window.confirm('Confirma exclusão?')) {
      fetch(`/livros/${_id}`, {
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
  }

  atualizaCampo = (campo) => (e) => {
    this.setState({ [campo]: e.target.value });
  }

  abrirModalInserir = () => {
    this.setState({ modalTipo: 'inserir', _id: null, titulo: '', autor: '', editora: '' });
  }

  abrirModalAtualizar = (_id) => {
    this.setState({ modalTipo: 'inserir' });
    this.buscarLivro(_id);
  }

  fecharModal = () => {
    this.setState({ _id: null, titulo: '', autor: '', editora: '', modalTipo: null });
  }

  submit = () => {
    const { _id } = this.state;
    if (_id === null) {
      this.cadastrarLivro();
    } else {
      this.atualizarLivro();
    }
  }

  renderModal() {
    return (
      <Modal show={this.state.modalTipo === 'inserir'} onHide={this.fecharModal}>
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
            <tr key={livro._id}>
              <td className="tabela-estilo">{livro.titulo}</td>
              <td className="tabela-estilo">{livro.autor}</td>
              <td className="tabela-estilo">{livro.editora}</td>
              <td>
                <Button className="btn btn-info btn-espaco" onClick={() => this.abrirModalAtualizar(livro._id)}>Editar</Button>
                <Button className="btn btn-danger" onClick={() => this.excluirLivro(livro._id)}>Excluir</Button>
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
        <Button variant="primary" className="botao add" onClick={this.abrirModalInserir}>Adicionar Livro</Button>
        {this.renderTabela()}
        {this.renderModal()}
      </div>
    );
  }
}

export default Livros;
