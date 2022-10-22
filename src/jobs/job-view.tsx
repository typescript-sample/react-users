import React, { useState, useEffect } from 'react'
import './job.css'
import { Job } from './service/jobs'
import {
    Chip
} from "@mui/material";
import { useNavigate } from 'react-router';

interface Props {
    job: Job | undefined;
}
export const JobView = ({ job }: Props) => {
    const [itemJob, setItemJob] = useState<Job>()
    useEffect(() => {
        setItemJob(job)
    })
    const navigate = useNavigate()
    return (
        <div className='job-view'>
            <header>
                <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={()=>(navigate('/jobs'))} />
            </header>
            {
                itemJob && (
                    <>
                        <div className="job-title">
                            <h1>{itemJob.title}</h1>
                        </div>
                        <div className="job-skill">
                            {itemJob.skill ? (
                                itemJob.skill.map((c: any, i: number) => {
                                    return <Chip key={i} label={c} size="small" />;
                                })
                            ) : (
                                <span></span>
                            )}
                        </div>
                        <div className="job-quantity">
                            <span>Số lượng:</span>
                            <span>{itemJob.quantity}</span>
                        </div>
                        <div className="job-time">
                            <span>{`Ngày hết hạn ${itemJob.expiredAt?.getDate()}/${itemJob.expiredAt?.getMonth()}/${itemJob.expiredAt?.getFullYear()} `}</span>
                        </div>
                        <div className="job-benefit">
                            <h2>Benefit for you</h2>
                            {itemJob.benefit.split('. ').map((item, index) => {
                                return (
                                    <p>- {item}.</p>
                                )
                            })}
                        </div>
                        <div className="job-description">
                            <h2>Job description</h2>
                            {itemJob.description.split('. ').map((item, index) => {
                                return (
                                    <p>- {item}.</p>
                                )
                            })}
                        </div>
                        <div className="job-requirements">
                            <h2>Job requirements</h2>
                            {itemJob.requirements.split('. ').map((item, index) => {
                                return (
                                    <p>- {item}.</p>
                                )
                            })}
                        </div>
                    </>
                )
            }
        </div>
    )
}
