import axios from 'axios';
import { HttpRequest } from 'axios-core';
import React, { useMemo } from 'react'
import { options } from 'uione';
import { UploadForm } from '../backoffice/upload-form';
import { config } from '../config'
import { getRoomService } from './service';

const httpRequest = new HttpRequest(axios, options);
export function BRoomUpload() {
  const service = useMemo(() => getRoomService(), [])
  return (
    <UploadForm
      url={config.backoffice_room_url}
      post={httpRequest.post}
      sv={service}/>
  )
}
