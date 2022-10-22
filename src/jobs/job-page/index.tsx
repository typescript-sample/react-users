import React,{useEffect, useState} from 'react'
import { JobView } from '../job-view'
import {getJobsService} from '../service'
import { Link, useParams } from 'react-router-dom';
import { Job } from '../service';
import { useNavigate } from 'react-router';
export const JobPage = () => {
  const navigate = useNavigate()
  const [job, setJob] = useState<Job>();
  const jobService=getJobsService()
  const { id = '' } = useParams()
  useEffect(()=>{
    getJob(id)
  },[])
  const getJob=async (id:string)=>{
    const currentJob= await jobService.load(id)
    if(currentJob){
      setJob(currentJob)
    }
  }
  return (
    <div className='view-container'>
        <JobView job={job} />
    </div>
  )
}
