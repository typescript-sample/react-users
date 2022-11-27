import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { buildId, DispatchWithCallback, error } from 'react-hook-core'
import { confirm, handleError, showAlert, showMessage, storage, StringMap, useResource } from 'uione'
import { User, getUserService } from '../../admin/service'
import { Company, getCompanyService } from './service'
import { UsersLookup } from '../../admin/users-lookup'
import femaleIcon from '../../assets/images/female.png'
import maleIcon from '../../assets/images/male.png'

interface InternalState {
  company: Company
  isOpenModel: boolean
  isCheckboxShown: boolean
  users: User[]
  selectedUsers: User[]
  q: string
} // End of InternalState

const DOC_TITLE = "User assignment | Company | Back office | React-Users"

const INITIAL_STATE: InternalState = {
  company: {} as any,
  isOpenModel: false,
  isCheckboxShown: false,
  users: [],
  selectedUsers: [],
  q: ''
} // End of INITIAL_STATE

async function initialize(set: DispatchWithCallback<Partial<InternalState>>, state: Partial<InternalState>, companyId: string) {
  try {
    const [company, users] = await Promise.all([getCompanyService().load(companyId), getUserService().getUsersByCompany(companyId)])

    if (company || (users && users.length)) {
      set({...state, company: company || undefined, users: users || []})
    }
  }
  catch (err) {
    error(err, storage.resource().value, storage.alert)
  }
} // End of initialize

function selectUser(set: DispatchWithCallback<Partial<InternalState>>, state: Partial<InternalState>, users: User[], selectedUsers: User[], userId: string) {
  if (!userId || userId.length === 0 || !users || users.length === 0) {
    return
  }

  const user = users.find(usr => usr.id === userId)

  if (!user) {
    return
  }

  const selUsrIdx = selectedUsers.indexOf(user)

  if (selUsrIdx >= 0) {
    selectedUsers.splice(selUsrIdx, 1)
  }
  else {
    selectedUsers.push(user)
  }

  set({ ...state, selectedUsers })
} // End of selectUser

async function assignUsersToCompany(set: DispatchWithCallback<Partial<InternalState>>, state: Partial<InternalState>, resource: StringMap, addingUsers: User[]) {
  if (!addingUsers || addingUsers.length === 0) {
    set({...state, isOpenModel: false, q: ''})
    return
  }

  const {users} = state

  if (users && users.length > 0) {
    addingUsers = addingUsers.filter(usr => !users.find(u => u.id === usr.id))
  }

  if (!addingUsers || addingUsers.length === 0) {
    set({...state, isOpenModel: false, q: ''})
    return
  }

  const {company} = state

  try {
    const rsl = await getCompanyService().assignUsers(company?.id || '', addingUsers.map(usr => usr.id))

    if (rsl <= 0) {
      showAlert(resource.msg_approve_error)
      return
    }

    set({ ...state, q: '', users: [...(users || []), ...addingUsers], isOpenModel: false })
    showMessage(resource.msg_save_success)
  }
  catch (reason) {
    handleError(reason)
  }
} // End of assignUsersToCompany

function deassignUsersFromCompany(set: DispatchWithCallback<Partial<InternalState>>, state: Partial<InternalState>, resource: StringMap) {
  const {isCheckboxShown, users, selectedUsers} = state

  if (!isCheckboxShown || !users || users.length === 0 || !selectedUsers || selectedUsers.length === 0) {
    return
  }

  confirm(resource.msg_confirm_delete, resource.confirm, async () => {
    const {company} = state

    try {
      const rsl = await getCompanyService().deassignUsers(company?.id || '', selectedUsers.map(usr => usr.id))

      if (rsl <= 0) {
        showAlert(resource.msg_delete_failed)
        return
      }

      const newUsersList = users.filter(usr => selectedUsers.find(u => u.id === usr.id) === undefined)
      set({ ...state, users: newUsersList, selectedUsers: [], isCheckboxShown: false })
      showMessage(resource.msg_save_success)
    }
    catch (reason) {
      handleError(reason)
    }
  })
} // End of deassignUsersFromCompany

function renderCheckAllButtons(set: DispatchWithCallback<Partial<InternalState>>, state: Partial<InternalState>, resource: StringMap, isCheckboxShown: boolean) {
  return (
    isCheckboxShown ?
    <>
      <button type='button' onClick={() => set({...state, selectedUsers: state.users || []})}>{resource.check_all}</button>
      <button type='button' onClick={() => set({...state, selectedUsers: []})}>{resource.uncheck_all}</button>
    </> :
    <></>
  )
} // End of renderCheckAllButtons

function renderDeleteButton(set: DispatchWithCallback<Partial<InternalState>>, state: Partial<InternalState>, resource: StringMap) {
  const {isCheckboxShown, selectedUsers} = state

  return isCheckboxShown && selectedUsers && selectedUsers.length > 0
    ? <button type='button' onClick={() => deassignUsersFromCompany(set, state, resource)}>{resource.delete}</button>
    : <></>
} // End of renderDeleteButton

function renderListUsers(set: DispatchWithCallback<Partial<InternalState>>, state: Partial<InternalState>, users: User[], selectedUsers: User[], isCheckboxShown: boolean) {
  if (!users || users.length === 0) {
    return (<></>);
  }

  return (
    <ul className='row list-view'>
      {
        users.map((user, idx) => {
          const isSelected = selectedUsers.find(usr => usr.id === user.id) !== undefined;
          const avatar = user.imageURL && user.imageURL.length > 0 ? user.imageURL : user.gender === 'F' ? femaleIcon : maleIcon;

          return (
            <li key={idx} className='col s12 m6 l4 xl3'>
              <section>
                {
                  isCheckboxShown === true
                  ? <input type='checkbox' name='selected' checked={isSelected} onChange={e => selectUser(set, state, users, selectedUsers, user.id)} />
                  : ''
                }
                <img alt='' src={avatar} className='round-border' />
                <div>
                  <h3>
                    {user.displayName}
                  </h3>
                  <p>
                    {user.email}
                  </p>
                </div>
              </section>
            </li>
          )
        })
      }
    </ul>
  )
} // End of renderListUsers

export const CompanyUsersAssignment = () => {
  const params = useParams()
  const [state, setState] = useState(INITIAL_STATE)

  useEffect(() => {
    document.title = DOC_TITLE
    const id = buildId<string>(params)

    if (id) {
      initialize(setState as any, state, id)
    }
  }, []) // End of useEffect

  const resource = useResource();
  const navigate = useNavigate();
  const { company, isCheckboxShown, users, selectedUsers, q, isOpenModel } = state;

  return (
    <div className='view-container'>
      <form id='CompanyUsersAssignment' name='CompanyUsersAssignment' model-name='company'>
        <header>
          {/* Handle the case: "User access to this page directly by url, so the back button is going to wrong behaviour" */}
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={() => company.id ? navigate(`/backoffice/companies/edit/${company.id}`) : navigate(-1)} />
          <h2>{company.name ? company.name : resource.companyUsersAssignmentHeading}</h2>
        </header>

        {/*
          TODO: Don't use the below syntax to style the document
            - .page-body .view-container > form > div
            - .view-container > form > div
        */}
        <div>
          {/* Top section: The company information */}
          <section className='row'>
            <label className='col s12 m6'>
              {resource.companyUsersAssignmentFieldCompanyId}
              <input id='CompanyId' name='CompanyId' type='text' value={company.id || ''} maxLength={255} placeholder={resource.companyUsersAssignmentFieldCompanyId} disabled={true} />
            </label>

            <label className='col s12 m6'>
              {resource.companyUsersAssignmentFieldCompanyName}
              <input id='CompanyName' name='CompanyName' type='text' value={company.name || ''} maxLength={255} placeholder={resource.companyUsersAssignmentFieldCompanyName} disabled={true} />
            </label>
          </section>

          {/* Users grid section */}
          <section className='row detail'>
            {/* BEGIN: Users grid's toolbar */}
            <h4>
              {resource.user}

              <div className='btn-group'>
                <button type='button' onClick={() => setState({...state, isOpenModel: true})}>
                  {resource.add}
                </button>

                <button type='button' onClick={() => setState({ ...state, isCheckboxShown: !isCheckboxShown })}>
                  {isCheckboxShown ? resource.deselect : resource.select}
                </button>

                {renderCheckAllButtons(setState as any, state, resource, isCheckboxShown)}
                {renderDeleteButton(setState as any, state, resource)}
              </div>
            </h4>

            <label className='col s12 search-input'>
              <i className='btn-search' />
              <input type='text' id='q' name='q' value={q} onChange={() => {}} maxLength={40} placeholder={resource.companyUsersAssignmentFieldSearchKeyword} autoComplete='off' />
              <button type='button' hidden={!q} className='btn-remove-text' />
            </label>
            {/* END: Users grid's toolbar */}
            {renderListUsers(setState as any, state, users, selectedUsers, isCheckboxShown)}
          </section>
        </div>
      </form>

      <UsersLookup isOpenModel={isOpenModel} onModelClose={() => setState({...state, isOpenModel: false})} onModelSave={selUsrs => assignUsersToCompany(setState as any, state, resource, selUsrs)} users={users} />
    </div>
  )
} // End of CompanyUsersAssignment