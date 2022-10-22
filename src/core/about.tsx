import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AboutPage: React.FunctionComponent = () => {
  const [message, setMessage] = useState('');
  const { number } = useParams();

  useEffect(() => {
    if (number) {
      setMessage('The number is ' + number);
    } else {
      setMessage('No number was provided');
    }
  }, [number]);

  return (
    <div>
      <p>This is the about page.</p>
      <p>{message}</p>
    </div>
  );
};

export default AboutPage;
