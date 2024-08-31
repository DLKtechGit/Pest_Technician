import Spinner from 'react-bootstrap/Spinner';

function Loader({show}) {
  return (
    <>
      <div className="loading-screen">
      <Spinner show={show} animation="border" style={{color:'rgb(109 201 7 / 97%)'}} variant="#76427" />
      </div>
      
    </>
  );
}

export default Loader;

//  <div className="loading-spinner mb-2"></div>
// <div>Loading</div>               