import { useEffect, useState } from "react";

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

export default function App () {

  const [images, setImages] = useState ([])
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [modalImg, setModalImg] = useState('');
  const [modalAlt, setModalAlt] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.trim() === '') {
      return;
    }

    setStatus('pending');
    
    API.fetchQuery(query, page)
      .then(({ hits }) => {
        const images = hits.map(({ id, webformatURL, largeImageURL, tags }) => {
          return { id, webformatURL, largeImageURL, tags };
        });
        if (images.length > 0) {
          setImages(state => [...state, ...images]);
          setStatus('resolved')
        } else {
          toast.error(`По запиту ${query} ми нічого не знайшли.`);
          setStatus('idle');
        }
      }).catch(error => {
        setError(error);
        setStatus('rejected');
      })},[page, query]);
 

  const handleSubmitInput = newQuery => {
    if (newQuery !== query) {
      setImages([]);
      setPage(1);
      setQuery(newQuery);
    }
  };
  
const handleClickImg = event => {
    const imgForModal = event.target.dataset.src;
    const altForModal = event.target.alt;
  if (event.target.nodeName !== 'IMG') {
        return;
      }  
  
  setModalImg(imgForModal);
  setModalAlt(altForModal);
  setShowModal(true);
  };
  
 const handleClickBtn = () => {
   setPage(state => state + 1);
    setStatus('pending');
 };
  
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  
  if (status === 'idle') {
      return (
        <div>
          <Searchbar onSubmit={handleSubmitInput} />
          <ToastContainer autoClose={2000}/>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div>
          <Searchbar onSubmit={handleSubmitInput} />
          {query.length > 0 && <ImageGallery query={images} />}
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
            <Modal onClose={toggleModal}>
              <img src={modalImg} alt={modalAlt} />
            </Modal>
          )}
          <div>
            <Searchbar onSubmit={handleSubmitInput} />
            <ImageGallery onClickImg={handleClickImg} query={images} />
            {images.length > 11 && <Button handleClickBtn={handleClickBtn} />}
          </div>
        </>
      );
    }
} 