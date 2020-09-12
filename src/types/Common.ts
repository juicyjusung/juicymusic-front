import { Vue } from 'vue-property-decorator';

export type VForm = Vue & {
  validate: (arg0: boolean) => boolean;
  resetValidation: () => boolean;
  reset: () => void;
};
