import { FormCard } from './form-card';
import { FormCardHeader } from './form-card-header/form-card-header';
import { FormCardBody } from './form-card-body/form-card-body';
import { FormCardFooter } from './form-card-footer/form-card-footer';

export const FORM_CARD_IMPORTS = [
  FormCard,
  FormCardHeader,
  FormCardBody,
  FormCardFooter,
] as const;