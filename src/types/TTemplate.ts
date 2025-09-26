import { FUNC, JEST, JOTAI_STATE, REACT, RECOIL_STATE } from '../templates';

type TTemplate =
  | typeof FUNC
  | typeof JEST
  | typeof REACT
  | typeof RECOIL_STATE
  | typeof JOTAI_STATE;

export default TTemplate;
