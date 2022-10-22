import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p>This is the home page.</p>
      <Link to='/about'>Go to the About Page!</Link>
      <Link to='/auth'>Go to the Login Page!</Link>
      <Link to='/signin'>Go to the sign in Page!</Link>
      <br />
      <button onClick={() => navigate('/layout/55')}>Go to layout, with a number</button>
    </div>
  );
};

export default HomePage;
