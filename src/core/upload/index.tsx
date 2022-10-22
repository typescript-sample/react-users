import * as React from 'react';
import { OnClick } from 'react-hook-core';
import 'react-image-crop/dist/ReactCrop.css';
import { FileInfo, FileUploadProps } from 'reactx-upload';
import { DragDrop } from './DragDrop';
import { UploadContainer } from './UploadContainer';

export * from './DragDrop';
export * from './UploadContainer';

export const FileUpload = ({
  type = 'gallery',
  post,
  url,
  id,
  sizes = [],
  setGallery,
  getGalllery,
  uploadExternalResource,
  deleteFileYoutube,
  deleteFile,
  update
}: FileUploadProps) => {
  const [filesUploaded, setFilesUploaded] = React.useState<FileInfo[]>();
  const [videoIdInput, setVideoIdInput] = React.useState<string>('');
  React.useEffect(() => {
    fecthGallery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  React.useEffect(() => {
    // tslint:disable-next-line:no-unused-expression
    setGallery && setGallery(filesUploaded ?? []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesUploaded]);

  const fecthGallery = () => {
    // tslint:disable-next-line:no-unused-expression
    getGalllery && getGalllery(id).then((rs: FileInfo[]) => {
      setFilesUploaded(rs);
    });

  };
  const handleFetch = async (data: FileInfo[]) => {
    setFilesUploaded(data);
  };

  const handleDeleteFile = (purl: string, ptype: string) => {
    if (ptype === 'youtube') {
      deleteFileYoutube(id, purl).then(() => {
        setFilesUploaded(filesUploaded?.filter((file) => file.url !== purl));
      });

    } else {
      deleteFile(id, purl).then(() => {
        setFilesUploaded(filesUploaded?.filter((file) => file.url !== purl));
      });

    }
  };

  const handleInput = (e: { target: { value: string } }) => {
    setVideoIdInput(e.target.value);
  };

  const handleAddVideoYoutube = (e: OnClick) => {
    e.preventDefault();
    if (videoIdInput !== '') {
      uploadExternalResource(id, videoIdInput).then(() => {
        setVideoIdInput('');
        fecthGallery();
      }
      );
    }
  };
  return (
    <div className='container'>
      <div className='row'>
        <div className='col xl4 l5 m12 s12'>
          <div style={{ textAlign: 'center' }}>
            <UploadContainer
              sizes={sizes}
              url={url}
              id={id}
              post={post}
              setFileGallery={handleFetch}
              type={type}
              aspect={0}
            />
            <div className='youtube-add'>
              <input
                onChange={handleInput}
                value={videoIdInput}
                className='input-video-id'
                type='type'
                placeholder='Input youtube video id'
              />
              <button
                className='btn-add-youtube'
                onClick={handleAddVideoYoutube}
              >
                <i className='material-icons icon-delete'>library_add</i>
              </button>
            </div>
          </div>
        </div>
        <div className='col xl8 l7 m12 s12'>
          <div className='file-area'>
            <div className='label'>
              <i className='menu-type' />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className='material-icons menu-type'>description</i>
                <span className='menu-type'>File</span>
              </div>
            </div>
            {filesUploaded && filesUploaded.length > 0 && (
              <DragDrop
                setList={setFilesUploaded}
                handleDeleteFile={handleDeleteFile}
                list={filesUploaded}
                update={update}
                id={id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
