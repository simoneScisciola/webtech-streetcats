import { SidePanel } from './side-panel';
import { SidePanelHeader } from './side-panel-header/side-panel-header';
import { SidePanelBody } from './side-panel-body/side-panel-body';
import { SidePanelFooter } from './side-panel-footer/side-panel-footer';

export const FORM_CARD_IMPORTS = [
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter,
] as const;