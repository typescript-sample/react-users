import {Resources, StringMap} from 'uione';
import {en as adminEN} from './admin/en';
import {vi as adminVI} from './admin/vi';
import {en as authenticationEN} from './authentication/en';
import {vi as authenticationVI} from './authentication/vi';
import {l10n as backofficeCompanyEN} from './backoffice-company/en';
import {l10n as backofficeCompanyVI} from './backoffice-company/vi';
import {en as myprofileEN} from './my-profile/en';
import {vi as myprofileVI} from './my-profile/vi';

import {en as commonEN} from './en';
import {vi as commonVI} from './vi';

const en: StringMap = {
  ...commonEN,
  ...authenticationEN,
  ...backofficeCompanyEN,
  ...adminEN,
  ...myprofileEN
};
const vi: StringMap = {
  ...commonVI,
  ...authenticationVI,
  ...backofficeCompanyVI,
  ...adminVI,
  ...myprofileVI
};

export const resources: Resources = {
  'en': en,
  'vi': vi
};
