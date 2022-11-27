import * as React from 'react'
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core'
import { getUser, handleSelect, inputEdit, requiredOnBlur, StringMap } from 'uione'
import { getJobsService, Job } from './service'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { Chip, Autocomplete, ThemeProvider, createTheme } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import { Company, getCompanyService } from '../../company/service'

const DOC_TITLE_SUFFIX = "Jobs | Back office | React-Users"

interface InternalState {
  jobs: Job
  companies: Company[]
} // End of InternalState

interface date {
  publishedAt: Date | null
  expiredAt: Date | null
} // End of date

const initialState: InternalState = {
  jobs: {} as Job,
  companies: []
} // End of initialState

const param: EditComponentParam<Job, string, InternalState> = {
  createModel: () => createModel<Job>(),

  initialize: async (id, load, setState, callback) => {
    const user = getUser()

    if (!user || !user.id) {
      return
    }

    const [companies] = await Promise.all([getCompanyService().getAllByUser(user.id)])
    setState({companies}, () => load(id))
  } // End of initialize
} // End of param

function selectCompany(event: React.ChangeEvent<HTMLSelectElement>, state: Partial<InternalState>, setState: DispatchWithCallback<Partial<InternalState>>) {
  const {jobs} = state

  if (!jobs) {
    return
  }

  handleSelect(event.target)
  jobs.companyId = event.target.value
  setState({jobs})
} // End of selectCompany

function renderCompanyDDL(resource: StringMap, state: Partial<InternalState>, setState: DispatchWithCallback<Partial<InternalState>>, flag: any) {
  const {jobs, companies} = state

  return flag.newMode || (jobs && !jobs.publishedAt)
    ? <select id='company' name='company' value={jobs?.companyId || ''} onChange={event => selectCompany(event, state, setState)} data-value required={true}>
        <option value=''>{resource.please_select}</option>
        {companies?.map((it, idx) => <option key={idx} value={it.id}>{it.name}</option>)}
      </select>
    : <input value={companies?.find(c => c.id === jobs?.companyId)?.name} readOnly={true} />
} // End of renderCompanyDDL

export const BJobForm = () => {
  const navigate = useNavigate()
  const refForm = React.useRef()
  const [categories, setCategories] = React.useState<string[]>([])
  const { resource, state, flag, setState, updateState, save } = useEdit<Job, string, InternalState>(refForm, initialState, getJobsService(), inputEdit(), param)
  const theme = createTheme({ palette: { primary: { main: "#4db6ac" } } })
  const [value, setValue] = React.useState<date>({ publishedAt: new Date, expiredAt: new Date })
  const {jobs, companies} = state

  React.useEffect(() => {
    document.title = `${resource[flag.newMode ? 'bo_job_creating_frm_heading' : 'bo_job_editing_frm_heading']} | ${DOC_TITLE_SUFFIX}`
  }, [flag]) // End of useEffect

  return (
    <div className='view-container'>
      <form id='jobsForm' name='jobsForm' model-name='jobs' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={() => navigate('/backoffice/jobs')} />
          <h2>
            {resource[flag.newMode ? 'bo_job_creating_frm_heading' : 'bo_job_editing_frm_heading']}
          </h2>
        </header>

        <div className="row">
          <label className='col s12 m6'>
            <h2>Id</h2>
            <input type='text' id='id' name='id' value={jobs.id || ''} readOnly={!flag.newMode} onChange={updateState} maxLength={20} required={true} placeholder='Id' />
          </label>

          <label className='col s12 m6'>
            <h2>
              {resource.bo_job_field_company}
            </h2>
            {renderCompanyDDL(resource, state, setState, flag)}
          </label>

          <label className='col s12'>
            <h2>Title</h2>
            <input type='text' id='title' name='title' value={jobs.title || ''} onChange={updateState} onBlur={requiredOnBlur} maxLength={40} required={true} placeholder='Title' />
          </label>

          <label className='col s12 m6'>
            <h2>Quantity</h2>
            <input type='number' id='quantity' name='quantity' value={jobs.quantity || ''}
                   onChange={(e: any) => setState({jobs: {...jobs, quantity: parseInt(e.currentTarget.value || '')}})}
                   onBlur={requiredOnBlur}
                   maxLength={40} required={true}
                   placeholder={"quantity"} />
          </label>

          <label className='col s12 m6'>
            <h2>Applicant Count</h2>
            <input type='number' id='applicantCount' name='applicantCount' value={jobs.applicantCount || ''}
                   onChange={(e: any) => setState({jobs: {...jobs, applicantCount: parseInt(e.currentTarget.value || '')}})}
                   onBlur={requiredOnBlur}
                   maxLength={40} required={true}
                   placeholder={"applicantCount"} />
          </label>

          <label className='col s12 m6'>
            <h2>Description</h2>
            <textarea rows={9} cols={70} id='description' name='description' onBlur={requiredOnBlur}
                      onChange={(e: any) => setState({jobs: {...jobs, description: e.target.value}})}
                      defaultValue={jobs.description || ''}
                      placeholder={resource.description}></textarea>
          </label>

          <label className='col s12 m6'>
            <h2>Benefit</h2>
            <textarea rows={9} cols={70} id='benefit' name='benefit' onBlur={requiredOnBlur}
                      onChange={(e: any) => setState({jobs: {...jobs, benefit: e.target.value}})}
                      defaultValue={jobs.benefit || ''}
                      placeholder={resource.benefit}></textarea>
          </label>

          <label className='col s12 m6'>
            <h2>Requirements</h2>
            <textarea rows={9} cols={70} id='requirements' name='requirements' onBlur={requiredOnBlur}
                      onChange={(e: any) => setState({jobs: {...jobs, requirements: e.target.value}})}
                      defaultValue={jobs.requirements || ''}
                      placeholder={resource.requirements}></textarea>
          </label>

          <label className='col s12 m6'>
            <h2>Skill</h2>
            <Autocomplete
              options={[]}
              multiple
              id="tags-filled"
              freeSolo
              value={jobs.skill || categories}
              onChange={(e: any, newValue: string[]) => {
                if (newValue.length > -1) {
                  setCategories(newValue)
                  setState({jobs: {...jobs, skill: newValue}})
                }
              }}
              renderTags={(v: readonly string[], getTagProps: any) => v.map((option: string, i: number) => (<Chip key={i} variant="outlined" label={option} {...getTagProps({ i })} />))}
              renderInput={(params: any) => (
                <ThemeProvider theme={theme}>
                  <TextField {...params} variant="standard" name="categories" color="primary" label={resource.categories} placeholder={resource.categories} />
                </ThemeProvider>
              )}
            />
          </label>

          <label className='col s12 m6'>
            <h2>Published At</h2>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="MM/dd/yyyy"
                  value={jobs.publishedAt || ''}
                  onChange={(newValue: Date | null) => {
                    setValue({...value, publishedAt: newValue})
                    setState({jobs: {...jobs, publishedAt: newValue}})
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </label>

          <label className='col s12 m6'>
            <h2>Expired At</h2>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="MM/dd/yyyy"
                  value={jobs.expiredAt || ''}
                  onChange={(newValue: Date | null) => {
                    setValue({...value, expiredAt: newValue})
                    setState({jobs: {...jobs, expiredAt: newValue}})
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </label>
        </div>

        <footer>
          <button type='submit' id='btnSave' name='btnSave' onClick={save}>
            {resource.save}
          </button>
        </footer>
      </form>
    </div>
  )
} // End of BJobForm