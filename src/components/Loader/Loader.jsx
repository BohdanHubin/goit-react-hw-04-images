import { RotatingLines } from 'react-loader-spinner';
import s from 'components/styles.module.css';

function Spinner() {
  return (
    <div className={s.Loader}>
      <RotatingLines strokeColor="grey" strokeWidth="4" animationDuration="1" width="196" visible={true} />
    </div>
  );
}

export default Spinner;