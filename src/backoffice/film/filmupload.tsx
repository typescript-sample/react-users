import axios from 'axios';
import { HttpRequest } from 'axios-core';
import React, { useMemo } from 'react'
import { options } from 'uione';
import { config } from '../../config';
import { UploadForm } from '../upload-form';
// import { UploadForm } from '../backoffice/upload-form';
// import { config } from '../config'
import { getFilmService } from './service';

const httpRequest = new HttpRequest(axios, options);
export function FilmUpload() {
  const service = useMemo(() => getFilmService(), [])
  return (
    <UploadForm
      url={config.backoffice_film_url}
      post={httpRequest.post}
      sv={service}/>
  )
}
