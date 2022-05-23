import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import s from 'components/Searchbar/Searchbar.module.css';
import { ImSearch } from 'react-icons/im';
export default function Searchbar({ onSubmit }) {
  const [imageName, setImageName] = useState('');
  const handleNameChange = event => {
    setImageName(event.target.value.toLowerCase());
  };
  const handleSubmit = event => {
    event.preventDefault();
    if (imageName.trim() === '') {
      toast.error('Enter a keyword to search!');
      return;
    }

    onSubmit(imageName);
    setImageName('');
  };

  return (
    <div className={s.container}>
      <form className={s.form} onSubmit={handleSubmit}>
        <button type="submit" className={s.button}>
          <span className="button-label">
            <ImSearch style={{ marginRight: 8 }} />
            Search
          </span>
        </button>

        <input
          className={s.input}
          type="text"
          autoComplete="off"
          autoFocus
          value={imageName}
          placeholder="Search images and photos"
          onChange={handleNameChange}
        />
      </form>
    </div>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
