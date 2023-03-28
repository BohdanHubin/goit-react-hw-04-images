import { Component } from "react";

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from 'components/styles.module.css';

import API from "./Api/Api"
import Searchbar from "./Searchbar/Searchbar";
import ImageGallery from "components/ImageGallery/ImageGallery";
import Button from "components/Button/Button";
import Modal from "components/Modal/Modal";
import Spinner from "components/Loader/Loader";

export default class App extends Component {

  state = {
    status: 'idle',
    query: [],
    page: 1,
    name: '',
    modalAlt: '',
    showModal: false,
    modalImg: '',
    error: null,
  };

componentDidUpdate(_, prevState) {
    const prevQuery = prevState.name;
    const nextQuery = this.state.name;

    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevQuery !== nextQuery) {
      this.setState({ query: [], status: 'pending' });
    }

    if (prevQuery !== nextQuery || prevPage !== nextPage) {
      API
        .fetchQuery(nextQuery, nextPage)
        .then(({ hits }) => {
          const images = hits.map(({ id, webformatURL, largeImageURL, tags }) => {
            return { id, webformatURL, largeImageURL, tags };
          });
          if (images.length > 0) {
            this.setState(prevState => {
              return {
                query: [...prevState.query, ...images],
                status: 'resolved',
              };
            });
          } else {
            toast.error(`По запиту ${nextQuery} ми нічого не знайшли.`);
            this.setState({ status: 'idle' });
          }
        })
        .catch(error => this.setState({ error, status: 'rejected' }));
    }
  }  

handleSubmitInput = newQuery => {
    if (newQuery !== this.state.name) {
      this.setState({ name: newQuery, page: 1, status: 'pending' });
    }
};
  
handleClickImg = event => {
    const imgForModal = event.target.dataset.src;
    const altForModal = event.target.alt;
  if (event.target.nodeName !== 'IMG') {
        return;
      }  
  
  this.setState({
      showModal: true,
      modalImg: imgForModal,
      modalAlt: altForModal,
    });
  };
  
  handleClickBtn = () => {
    this.setState(({ page }) => {
      return { page: page + 1, status: 'pending' };
    });
  };
toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };
  render() {
    const { query, showModal, modalImg, modalAlt, error, status } = this.state;

      if (status === 'idle') {
      return (
        <div>
          <Searchbar onSubmit={this.handleSubmitInput} />
          <ToastContainer autoClose={2000}/>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div>
          <Searchbar onSubmit={this.handleSubmitInput} />
          {this.state.query.length > 0 && <ImageGallery query={query} />}
          <Spinner className={s.Loader} />
        </div>
      );
    }

    if (status === 'rejected') {
      return <h1>{error.message}</h1>;
    }

    if (status === 'resolved') {
      return (
        <>
          {showModal && (
            <Modal onClose={this.toggleModal}>
              <img src={modalImg} alt={modalAlt} />
            </Modal>
          )}
          <div>
            <Searchbar onSubmit={this.handleSubmitInput} />
            <ImageGallery onClickImg={this.handleClickImg} query={this.state.query} />
            {this.state.query.length > 11 && <Button handleClickBtn={this.handleClickBtn} />}
          </div>
        </>
      );
    }
  }
  }




