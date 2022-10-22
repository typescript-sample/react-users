import { ValueText } from 'onecore';
import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { handleError, inputEdit, storage } from 'uione';
import { Article, getArticleService, getMasterData } from './service';
import { TextEditorComponent } from './text-editor';

interface InternalState {
  article: Article;
  titleList: ValueText[];
  positionList: ValueText[];
}

const createArticle = (): Article => {
  const article = createModel<Article>();
  return article;
};
const initialize = (id: string | null, load: (id: string | null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
  const masterDataService = getMasterData();
  Promise.all([
    masterDataService.getTitles(),
    masterDataService.getPositions()
  ]).then(values => {
    const [titleList, positionList] = values;
    set({ titleList, positionList }, () => load(id));
  }).catch(handleError);
};

const initialState: InternalState = {
  article: {} as Article,
  titleList: [],
  positionList: []
};

const param: EditComponentParam<Article, string, InternalState> = {
  createModel: createArticle,
  initialize
};
export const MyArticle = () => {
  const refForm = React.useRef();
  const refEdit = React.useRef<any>();
  const [content, setContent] = React.useState<any>();
  const [test, setTest] = React.useState<any>();
  const { resource, state, setState, updateState, flag, save, back } = useEdit<Article, string, InternalState>(refForm, initialState, getArticleService(), inputEdit(), param);
  React.useEffect(() => {
    setContent(state.article.content);
  }, [state]);

  React.useEffect(() => {
    if (test) {
      save(test);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.article.content]);
  const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const data = refEdit.current.getData();
    setTest(e);
    console.log('state',state.article)
    setState({ article: { ...state.article, content: data ,authorId:storage.getUserId()??''} });
  };

  return (
    <div className='view-container'>
      <form id='articleForm' name='articleForm' model-name='article' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>Edit Article</h2>
        </header>
        <div className='row'>
          <label className='col s12 m6'>
            Id
            <input
              type='text'
              id='id'
              name='id'
              value={state.article.id}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={40} required={true}
            />
          </label>
          {/* <label className='col s12 m6'>
          authorId
            <input
              type='text'
              id='authorId'
              name='authorId'
              value={state.article.authorId}
              readOnly={false}
              onChange={updateState}
              maxLength={20} required={true}
            />
          </label> */}
          <label className='col s12 m6'>
            {resource.person_title}
            <input
              type='text'
              id='title'
              name='title'
              value={state.article.title}
              onChange={updateState}
              maxLength={300}
              required={true}
              placeholder={resource.person_title} />
          </label>
          <label className='col s12 m6'>
            {resource.description}
            <input
              type='text'
              id='description'
              name='description'
              value={state.article.description}
              onChange={updateState}
              maxLength={1000}
              required={true}
              placeholder={resource.description} />
          </label>
          <label className='col s12 m6'>
            Type
            <input
              type='text'
              id='type'
              name='type'
              value={state.article.type}
              onChange={updateState}
              maxLength={40}
              required={true}
              placeholder={resource.type} />
          </label>
          <label className='col s12'>
            <TextEditorComponent ref={refEdit} html={content} ></TextEditorComponent>
          </label>
        </div>
        <footer>
          {!flag.readOnly &&
            <button type='submit' id='btnSave' name='btnSave' onClick={handleSave}>
              {resource.save}
            </button>}
        </footer>
      </form>
    </div>
  );
};
