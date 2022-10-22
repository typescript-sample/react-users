import axios from 'axios';
import { HttpRequest } from 'axios-core';
import React, { useMemo } from 'react'
import { options } from 'uione';
import { UploadForm } from '../backoffice/upload-form';
import { config } from '../config'
import { getCinemaService } from './service';

const httpRequest = new HttpRequest(axios, options);
export function CinemaUpload() {
  const service = useMemo(() => getCinemaService(), [])
  return (
    <UploadForm
      url={config.backoffice_cinema_url}
      post={httpRequest.post}
      sv={service} />
  )
}
