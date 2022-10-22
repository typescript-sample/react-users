import axios from 'axios';
import { HttpRequest } from 'axios-core';
import React, { useMemo } from 'react'
import { options } from 'uione';
import { UploadForm } from '../backoffice/upload-form';
import { config } from '../config'
import { getLocations } from './service';

const httpRequest = new HttpRequest(axios, options);
export function LocationUpload() {
  const service = useMemo(() => getLocations(), [])
  return (
    <UploadForm
      url={config.backoffice_location_url}
      post={httpRequest.post}
      sv={service}
      />
  )
}
