import HyAll from '../Common/HyAll';

export default class extends HyAll {
  get tableName() {
    return 'homyit_mood_category';
  }

  async initFieldsOptions() {

    return {
      specialFields: {
        status: {
          title: '状态',
          form: {
            type: 'select',
          }
        }
      }
    }
  }
};