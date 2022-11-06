import * as csv from "csvtojson";
import { currency, locale } from "locale-service";
import { phonecodes } from "phonecodes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { alert, confirm } from "ui-alert";
import { loading } from "ui-loading";
import { resources as uiresources, UIService } from "ui-plus";
import { toast } from "ui-toast";
import { storage } from "uione";
import { resources as vresources } from "validation-core";
import { DefaultCsvService, resources } from "web-clients";
import { config } from "./config";
import AboutPage from "./core/about";
import HomePage from "./core/home";
import LayoutComponent from "./core/layout";
import { resources as locales } from "./core/resources";

import { RoleAssignmentForm } from "./admin/role-assignment-form";
import { RoleForm } from "./admin/role-form";
import { RolesForm } from "./admin/roles-form";
import { UserForm } from "./admin/user-form";
import { UsersForm } from "./admin/users-form";
import { ChangePasswordForm } from "./authentication/change-password-form";
import { ForgotPasswordForm } from "./authentication/forgot-password-form";
import { ResetPasswordForm } from "./authentication/reset-password-form";
import { SigninForm } from "./authentication/signin-form";
import { SignupForm } from "./authentication/signup-form";

import { CategoriesForm } from "./backoffice/categories-form";
import { CategoryForm } from "./backoffice/category-form";
import { FilmForm } from "./backoffice-film/film-form";
import { FilmsForm } from "./backoffice-film/films-form";
import { FilmForm as Film } from "./film/film-form";
import { FilmsForm as Films } from "./film/films-form";

import { LocationForm } from "./backoffice/location-form";
import { LocationsForm } from "./backoffice/locations-form";

import { BLocationForm } from "./backoffice-location/location-form";
import { BLocationsForm } from "./backoffice-location/locations-form";

import { LocationPage } from "./location/location-page";
import { LocationsPage } from "./location/locations-page";

import { MyProfileForm } from "./my-profile/my-profile-form";
import { MySettingsForm } from "./my-profile/my-settings-form";
import { UserPage } from "./profile/user-page";
import { UsersPage } from "./profile/users-page";

import { CinemasForm } from "./cinema/cinemas-form";
import { CinemaPage } from "./cinema/cinema-page";

import { BCinemasForm } from "./backoffice-cinema/cinemas-form";
import { BCinemaForm } from "./backoffice-cinema/cinema-form";

// import { BCinemasForm } from "./backoffice/cinemas-form";
// import { BCinemaForm } from "./backoffice/cinema-form";

import { CompaniesForm } from "./backoffice-company/companies-form";
import { CompanyForm } from "./backoffice-company/company-form";
import { CompanyUsersAssignment } from "./backoffice-company/company-users-assignment";
import { CompaniesFormClient } from "./company/companies-form";
import { CompanyFormClient } from "./company/company-page";


import { Articles } from "./article/articles";
import { ArticlesForm } from "./admin/articles-form";
import { ArticleForm } from "./article/article";
import { MyArticles } from "./my-articles/my-articles";
import { MyArticle } from "./my-articles/my-article";

import { ItemCategoriesForm } from "./my-items/categories-form";
import { ItemCategoryForm } from "./my-items/category-form";
import { MyItemsForm } from "./my-items/my-items-form";
import { MyItemForm } from "./my-items/my-item-form";
import { ItemsForm } from "./items/items-form";
import { ItemView } from "./items/item-view";

import { BJobsForm } from './backoffice-job/jobs-form'
import { BJobForm } from './backoffice-job/job-form'
import { JobsForm } from './jobs/jobs-form'
import { JobForm } from './jobs/job-form'
import { JobPage } from './jobs/job-page'
import { BRoomsForm } from "./backoffice-room/rooms-form";
import { BRoomForm } from "./backoffice-room/room-form";
import { RoomsForm } from "./room/rooms-form";
import { RoomForm } from "./room/room-form";

import { BMusicsForm } from './backoffice-music/musics-form'
import { BMusicForm } from './backoffice-music/music-form'
// import { MusicsForm } from './musics/musics-form'
// import { MusicForm } from './musics/music-form'
// import { MusicPage } from './musics/music-page'


// tslint:disable:ordered-imports
import "./assets/css/reset.css";
import "./App.css";
import "./assets/fonts/material-icon/css/material-icons.css";
import "./assets/fontawesome/css/font-awesome-min.css";
// import "./assets/fonts/Roboto/font.css";
import "./assets/css/checkbox.css";
import "./assets/css/radio.css";
import "./assets/css/grid.css";
import "./assets/css/alert.css";
import "./assets/css/loader.css";
import "./assets/css/main.css";
import "./assets/css/modal.css";
import "./assets/css/multi-select.css";
import "./assets/css/date-picker.css";
import "./assets/css/form.css";
import "./assets/css/diff.css";
import "./assets/css/article.css";
import "./assets/css/list-view.css";
import "./assets/css/table.css";
import "./assets/css/list-detail.css";
import "./assets/css/solid-container.css";
import "./assets/css/button.css";
import "./assets/css/search.css";
import "./assets/css/layout.css";
import "./assets/css/profile.css";
import "./assets/css/theme.css";
import "./assets/css/dark.css";
import { MusicsForm } from "./music/musics-form";
import { MusicForm } from "./music/music-form";
import { FilmUpload } from "./backoffice-film/filmupload";
import { LocationUpload } from "./backoffice-location/location-upload";
import { CinemaUpload } from "./backoffice-cinema/cinema-upload";
import { CompanyUpload } from "./backoffice-company/company-upload";
import { LoveSongForm } from "./music/love-song-form";
import { PlaylistForm } from "./music/playlist-form";
import { DetailPlaylist } from "./music/detail-playlist";
import { MyItem } from "./items/my-item";
import {MyLocation} from "./location/my-location";

let isInit = false;
export function init() {
  if (isInit) {
    return;
  }
  isInit = true;
  storage.setConfig(config);
  resources.csv = new DefaultCsvService(csv);
  resources.config = {
    list: "list",
  };
  if (storage.home == null || storage.home === undefined) {
    storage.home = "/admin/users";
  }
  storage.home = "/admin/users";
  // storage.token = getToken;
  storage.moment = true;
  storage.setResources(locales);
  storage.setLoadingService(loading);
  storage.setUIService(new UIService());
  storage.currency = currency;
  storage.locale = locale;
  storage.alert = alert;
  storage.confirm = confirm;
  storage.message = toast;

  const resource = storage.resource();
  vresources.phonecodes = phonecodes;
  // uiresources.date = parseDate;
  uiresources.currency = currency;
  uiresources.resource = resource;
}
function App() {
  init();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="home" element={<HomePage />} />
        <Route path="signin" element={<SigninForm />} />
        <Route path="signup" element={<SignupForm />} />
        <Route path="change-password" element={<ChangePasswordForm />} />
        <Route path="reset-password" element={<ResetPasswordForm />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
        <Route path="about">
          <Route index={true} element={<AboutPage />} />
          <Route path=":number" element={<AboutPage />} />
        </Route>
        <Route path="" element={<LayoutComponent />}>
          <Route index={true} element={<AboutPage />} />
          <Route path=":number" element={<AboutPage />} />
          <Route path="my-profile" element={<MyProfileForm />} />
          <Route path="my-profile/settings" element={<MySettingsForm />} />
          <Route path="profile" element={<UsersPage />} />
          <Route path="profile/:id" element={<UserPage />} />
          <Route path="profile/:id/review" element={<UserPage />} />
          <Route path="profile/:id/appreciation" element={<UserPage />} />
          <Route path="admin/users" element={<UsersForm />} />
          <Route path="admin/users/add" element={<UserForm />} />
          <Route path="admin/users/edit/:id" element={<UserForm />} />
          <Route path="admin/roles" element={<RolesForm />} />
          <Route path="admin/roles/add" element={<RoleForm />} />
          <Route path="admin/roles/edit/:id" element={<RoleForm />} />
          <Route
            path="admin/roles/assign/:id"
            element={<RoleAssignmentForm />}
          />

         
          <Route path="backoffice/cinemas/add" element={<BCinemaForm />} />
          <Route path="backoffice/cinemas" element={<BCinemasForm />} />
          <Route path="backoffice/cinemas/edit/:id" element={<BCinemaForm />} />
          <Route path="backoffice/cinemas/edit/:id/upload" element={<CinemaUpload />} />

          <Route path="cinemas" element={<CinemasForm />} />
          <Route path="cinemas/:id" element={<CinemaPage />} />
          <Route path="cinemas/:id/bookable" element={<CinemaPage />} />
          <Route path="cinemas/:id/review" element={<CinemaPage />} />
          <Route path="cinemas/:id/photo" element={<CinemaPage />} />
          <Route path="cinemas/:id/about" element={<CinemaPage />} />

          <Route path="backoffice/categories" element={<CategoriesForm />} />
          <Route
            path="backoffice/categories/edit/:id"
            element={<CategoryForm />}
          />
          <Route path="backoffice/categories/add" element={<CategoryForm />} />

          <Route path="backoffice/films" element={<FilmsForm />} />
          <Route path="backoffice/films/add" element={<FilmForm />} />
          <Route path="backoffice/films/edit/:id" element={<FilmForm />} />
          <Route path="backoffice/films/edit/:id/upload" element={<FilmUpload/>} />
          <Route path="films" element={<Films />} />
          <Route path="films/:id" element={<Film />} />
          <Route path="films/:id/review" element={<Film />} />
          

          <Route path="backoffice/locations" element={<BLocationsForm />} />
          <Route
            path="backoffice/locations/edit/:id"
            element={<BLocationForm />}
          />
          <Route path="backoffice/locations/add" element={<BLocationForm />} />
          <Route
            path="backoffice/locations/edit/:id/upload"
            element={<LocationUpload />}
          />

          <Route path="locations" element={<LocationsPage />} />
          <Route path="my-location" element={<MyLocation />} />
          <Route path="locations/add" element={<LocationForm />} />
          <Route path="locations/edit/:id" element={<LocationForm />} />
          <Route path="locations/:id" element={<LocationPage />} />
          <Route path="locations/:id/review" element={<LocationPage />} />
          <Route path="locations/:id/photo" element={<LocationPage />} />

          <Route path="backoffice/articles" element={<ArticlesForm />} />
          <Route path="my-articles" element={<MyArticles />} />
          <Route path="my-articles/add" element={<MyArticle />} />
          <Route path="my-articles/edit/:id" element={<MyArticle />} />
          
          <Route path="articles" element={<Articles />} />
          <Route path="articles/edit/:id" element={<ArticleForm />} />

          <Route path="my-items/categories" element={<ItemCategoriesForm />} />
          <Route path="my-item/categories/add" element={<ItemCategoryForm />} />
          <Route
            path="my-itesm/categories/edit/:id"
            element={<ItemCategoryForm />}
          />
          <Route path="my-items" element={<MyItemsForm />} />
          <Route path="my-items/add" element={<MyItemForm />} />
          <Route path="my-items/edit/:id/upload" element={<MyItemForm />} />
          <Route path="my-items/edit/:id" element={<MyItemForm />} />
          <Route path="items" element={<ItemsForm />} />
          <Route path="my-item" element={<MyItem />} />
          <Route path="items/:id" element={<ItemView />} />

          <Route path="backoffice/companies" element={<CompaniesForm />} />
          <Route path="backoffice/companies/add" element={<CompanyForm />} />
          <Route path="backoffice/companies/edit/:id" element={<CompanyForm />} />
          <Route path="backoffice/companies/edit/:id/upload" element={<CompanyUpload />} />
          <Route path="backoffice/companies/edit/:id/assign-users" element={<CompanyUsersAssignment />} />

          <Route path="companies" element={<CompaniesFormClient />} />
          <Route path="companies/:id" element={<CompanyFormClient />} />
          <Route path="companies/:id/about" element={<CompanyFormClient />} />
          <Route path="companies/:id/review" element={<CompanyFormClient />} />

          <Route path="jobs" element={<JobsForm />} />
          <Route path='jobs/add' element={<JobForm />} />
          <Route path='jobs/edit/:id' element={<JobForm />} />
          <Route path='jobs/view/:id' element={<JobPage />} />

          <Route path="backoffice/jobs" element={<BJobsForm />} />
          <Route path='backoffice/jobs/add' element={<BJobForm />} />
          <Route path='backoffice/jobs/edit/:id' element={<BJobForm />} />
          <Route path='backoffice/jobs/view/:id' element={<JobPage />} />

          <Route path="musics" element={<MusicsForm />} />
          <Route path="musics/search" element={<MusicsForm />} />
          <Route path="musics/search/:id" element={<MusicForm />} />
          <Route path="musics/save" element={<LoveSongForm />} />
          <Route path="musics/add" element={<MusicsForm />} />
          <Route path="musics/playlist" element={<PlaylistForm />} />
          <Route path="musics/playlist/:id" element={<DetailPlaylist />} />
          <Route path='musics/:id' element={<MusicForm />} />

          <Route path="backoffice/musics" element={<BMusicsForm />} />
          <Route path='backoffice/musics/add' element={<BMusicForm />} />
          <Route path='backoffice/musics/edit/:id' element={<BMusicForm />} />
          <Route path='backoffice/musics/view/:id' element={<MusicForm />} />

          
          <Route path="backoffice/rooms" element={<BRoomsForm />} />
          <Route path="backoffice/rooms/add" element={<BRoomForm />} />
          <Route path="backoffice/rooms/edit/:id" element={<BRoomForm />} />

          <Route path="rooms" element={<RoomsForm />} />
          <Route path="rooms/view/:id" element={<RoomForm />} />

          {/* <Route path={'upload/:id/image'} element={<UploadFile />} />
          <Route path={'upload'} element={<UploadFile />} /> */}
        </Route>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
  /*
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
  */
}
export default App;
