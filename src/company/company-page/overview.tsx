import { useLocation } from 'react-router-dom';
import { Company } from '../service';
export interface Props {
  company: Company;
}

export const Overview = ({ company }: Props) => {
    const locationPath = useLocation();
    if (company && locationPath.pathname.split('/').length === 3) {
        return (
            <>
               Overview
            </>
        );
    }
    return (
        <div></div>
    )
}