import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { emailOnBlur, Gender, handleError, handleSelect, inputEdit, phoneOnBlur, requiredOnBlur, Status } from 'uione';
import { getJobsService, Job } from './service';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
    Chip,
    Autocomplete,
    ThemeProvider,
    createTheme,
} from "@mui/material";

interface InternalState {
    jobs: Job;
}

const createJob = (): Job => {
    const jobs = createModel<Job>();
    return jobs;
};
const initialState: InternalState = {
    jobs: {} as Job,
};
const param: EditComponentParam<Job, string, InternalState> = {
    createModel: createJob
};
interface date {
    publishedAt: Date | null;
    expiredAt: Date | null;
}
export const JobForm = () => {
    const refForm = React.useRef();
    const [categories, setCategories] = React.useState<string[]>([]);
    const { resource, state, setState, updateState, flag, save, back } = useEdit<Job, string, InternalState>(refForm, initialState, getJobsService(), inputEdit(), param);
    const jobs = state.jobs;
    console.log(jobs)
    const theme = createTheme({
        palette: {
            primary: {
                main: "#4db6ac",
            },
        },
    });
    const [value, setValue] = React.useState<date>({
        publishedAt: new Date,
        expiredAt: new Date
    }
    );
    console.log(value.publishedAt)
    // const handleChange = (newValue: Date | null) => {
    //     setValue(newValue);
    // };
    return (
        <div className='view-container'>
            <form id='jobsForm' name='jobsForm' model-name='jobs' ref={refForm as any}>
                <header>
                    <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
                    <h2>{flag.newMode ? resource.create : resource.edit} {'job'}</h2>
                </header>
                <div className="row">
                    <label className='col s12 m6'>
                        <h2>Id</h2>
                        <input
                            type='text'
                            id='id'
                            name='id'
                            value={jobs.id || ''}
                            readOnly={!flag.newMode}
                            onChange={updateState}
                            maxLength={20} required={true}
                            placeholder='Id' />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Title</h2>
                        <input
                            type='text'
                            id='title'
                            name='title'
                            value={jobs.title || ''}
                            onChange={updateState}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder='Title' />
                    </label>
                    
                    <label className='col s12 m6'>
                        <h2>Quantity</h2>
                        <input
                            type='number'
                            id='quantity'
                            name='quantity'
                            value={jobs.quantity || ''}
                            onChange={(e: any) => {
                                const value = e.currentTarget.value || "";
                                setState({
                                    jobs: {
                                        ...jobs,
                                        quantity: parseInt(value),
                                    },
                                });
                            }}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder={"quantity"} />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Applicant Count</h2>
                        <input
                            type='number'
                            id='applicantCount'
                            name='applicantCount'
                            value={jobs.applicantCount || ''}
                            onChange={(e: any) => {
                                const value = e.currentTarget.value || "";
                                setState({
                                    jobs: {
                                        ...jobs,
                                        applicantCount: parseInt(value),
                                    },
                                });
                            }}
                            onBlur={requiredOnBlur}
                            maxLength={40} required={true}
                            placeholder={"applicantCount"} />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Description</h2>
                        <textarea rows={9} cols={70}
                            id='description'
                            name='description'
                            onBlur={requiredOnBlur}
                            onChange={(e: any) => {
                                    setState({
                                        jobs: {
                                            ...jobs,
                                            description:e.target.value ,
                                        },
                                    });
        
                            }}
                            defaultValue={jobs.description || ''}
                            placeholder={resource.description}
                        />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Benefit</h2>
                        <textarea rows={9} cols={70}
                            id='benefit'
                            name='benefit'
                            onBlur={requiredOnBlur}
                            onChange={(e: any) => {
                                    setState({
                                        jobs: {
                                            ...jobs,
                                            benefit:e.target.value ,
                                        },
                                    });
        
                            }}
                            defaultValue={jobs.benefit || ''}
                            placeholder={resource.benefit}
                        />
                    </label>
                    <label className='col s12 m6'>
                        <h2>Requirements</h2>
                        <textarea rows={9} cols={70}
                            id='requirements'
                            name='requirements'
                            onBlur={requiredOnBlur}
                            onChange={(e: any) => {
                                    setState({
                                        jobs: {
                                            ...jobs,
                                            requirements:e.target.value ,
                                        },
                                    });
        
                            }}
                            defaultValue={jobs.requirements || ''}
                            placeholder={resource.requirements}
                        />
                    </label>
                    <label className='col s12 m6'>
                        <h2>skill</h2>
                        <Autocomplete
                            options={[]}
                            multiple
                            id="tags-filled"
                            freeSolo
                            value={jobs.skill || categories}
                            onChange={(e: any, newValue: string[]) => {
                                if (newValue.length > -1) {
                                    setCategories(newValue)
                                    setState({
                                        jobs: {
                                            ...jobs,
                                            skill: newValue,
                                        },
                                    });
                                }
                            }}
                            renderTags={(v: readonly string[], getTagProps: any) =>
                                v.map((option: string, i: number) => (
                                    <Chip
                                        key={i}
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ i })}
                                    />
                                ))
                            }
                            renderInput={(params: any) => (
                                <ThemeProvider theme={theme}>
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        name="categories"
                                        color="primary"
                                        label={resource.categories}
                                        placeholder={resource.categories}
                                    />
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
                                        setValue({
                                            ...value,
                                            publishedAt: newValue
                                        })
                                        setState({
                                            jobs: {
                                                ...jobs,
                                                publishedAt: newValue,
                                            },
                                        });
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
                                        setValue({
                                            ...value,
                                            expiredAt: newValue
                                        })
                                        setState({
                                            jobs: {
                                                ...jobs,
                                                expiredAt: newValue,
                                            },
                                        });
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </label>

                </div>
                <footer>
                    <button type='submit' id='btnSave' name='btnSave' onClick={save}>
                        Save
                    </button>
                </footer>
            </form>
        </div>
    )
}
