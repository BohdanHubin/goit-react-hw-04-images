import PropTypes from 'prop-types';

import s from 'components/styles.module.css';

export default function ImageGalleryItem({ src, tags, dataSrc, onClickImg }) {
  return (
    <li className={s.ImageGalleryItem} onClick={onClickImg}>
      <img src={src} alt={tags} data-src={dataSrc} className={s.ImageGalleryItemImage} />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  src: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  dataSrc: PropTypes.string.isRequired,
  onClick: PropTypes.func
};