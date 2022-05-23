import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import { toast } from 'react-toastify';
import Container from 'components/Container/Container';
import Section from 'components/Section/Section';
import Modal from 'components/Modal/Modal';
import Loader from 'components/Loader/Loader';
// import { animateScroll as scroll } from 'react-scroll';
export default function App() {
  const [imageName, setImageName] = useState('');
  const [image, setImage] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(null);

  const handleSearchFormSubmit = imageName => {
    setImageName(imageName);
    setImage([]);
  };
  const switchModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (imageName === '') {
      return;
    } else {
      fetchData(imageName, page);
    }
  }, [imageName, page]);
  const fetchData = (text, num) => {
    fetch(
      `https://pixabay.com/api/?key=25742828-fa226770f9336c5f983da529f&q=${text}&image_type=photo&orientation=horizontal&safesearch&per_page=12&page=${num}`
    )
      .then(response => {
        if (response.ok) {
          let data = response.json();
          return data;
        }
        return Promise.reject(
          new Error(
            `Sorry, there are no images matching your search query ${text}. Please try again.`
          )
        );
      })
      .then(data => {
        const { hits, total } = data;

        setImage([...image, ...hits]);
        setStatus('resolved');
        setValue('true');

        if (total === 0) {
          setValue(true);
          toast.warning(
            `Sorry, there are no images matching your search query. Please try again.`
          );
        }
        if (total < 12) {
          setValue(false);
        }
        if (Math.ceil(total / 12) === page) {
          setValue(false);
        }
      })
      .catch(error => setError(error) && setStatus('rejected'));
  };
  const onGalleryListClick = event => {
    if (event.target.nodeName === 'IMG') {
      const index = image.findIndex(el => el.webformatURL === event.target.src);
      setModalImageIndex(index);
    }

    switchModal();
  };
  const showNextImage = () => {
    let nextIndex = modalImageIndex + 1;

    if (nextIndex >= image.length) {
      nextIndex = 0;
    }

    setModalImageIndex(nextIndex);
  };

  const showPrevImage = () => {
    let prevIndex = modalImageIndex - 1;

    if (prevIndex < 0) {
      prevIndex = image.length - 1;
    }
    setModalImageIndex(prevIndex);
  };
  const handleIncrement = () => {
    setPage(page + 1);
  };
  return (
    <div>
      <Container>
        <Searchbar onSubmit={handleSearchFormSubmit} />
      </Container>
      <Section nameForClass={'sectionList'}>
        {status === 'pending' && <Loader />}
        <ImageGallery image={image} onClick={onGalleryListClick} />
        {value && <Button handleIncrement={handleIncrement} />}
        {status === 'rejected' && { error }}
      </Section>
      {isModalOpen && (
        <Modal
          image={image}
          photoIndex={modalImageIndex}
          onClose={switchModal}
          nextImage={showNextImage}
          prevImage={showPrevImage}
        />
      )}
      <ToastContainer />
    </div>
  );
}
