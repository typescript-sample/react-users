import axios from 'axios';
import { HttpRequest } from 'axios-core';
import React, { useMemo } from 'react'
import { options } from 'uione';
import { UploadForm } from '../upload-form';
import { config } from '../../config'
import { getCompanyService } from './service';

const httpRequest = new HttpRequest(axios, options);
export function CompanyUpload() {
  const service = useMemo(() => getCompanyService(), [])
  return (
    <UploadForm
      url={config.backoffice_company_url}
      post={httpRequest.post}
      sv={service} />
  )
}
