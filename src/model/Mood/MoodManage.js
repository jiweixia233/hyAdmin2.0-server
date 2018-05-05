import HyAll from '../Common/HyAll';

export default class extends HyAll {
  get tableName() {
    return 'homyit_mood';
  }

  get relation() {
    return {
      mood_category: {
        type: think.Model.BELONG_TO,
        key: 'c_id'
      }
    };
  }

  async initFieldsOptions() {

    const category = await this.model('mood_category').where({status: 1}).select();

    const category_options = category.map(item => ({
      value: item.id,
      title: item.name
    }));

    return {
      ignoreFields: {
        all: [
          'mood_category_HY_SEP_status',
        ],
        list: ['c_id'],
        form: ['mood_category_HY_SEP_name']
      },
      specialFields: {
        c_id: {
          form: {
            title: '类别',
            type: 'select',
            options: category_options,
            placeholder: '请选择需要添加的分类'
          }
        },
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