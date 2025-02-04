import { Data } from './constant';

export default {
    '@init'({ style }) {
        style.height = 200;
        style.width = 300;
    },
    '@resize': {
        options: ['height', 'width'],
    },
    ':root'({ data }, cate0) {
        cate0.title = '迷你面积图';
        cate0.items = [
            {
                title: '百分比',
                type: 'inputNumber',
                options: [
                    { min: 0, max: 1, step: 0.05 },
                ],
                value: {
                    get({ data }: EditorResult<Data>) {
                        return [data.percent];
                    },
                    set({ data }: EditorResult<Data>, value: number[]) {
                        [data.percent] = value;
                    },
                }
            },
            {
                title: "样式配置",
                items: [
                    {
                        title: '有效区域颜色',
                        type: 'colorPicker',
                        value: {
                            get({ data }: EditorResult<Data>) {
                                return data.color[0];
                            },
                            set({ data }: EditorResult<Data>, value: string) {
                                data.color = [value, data.color[1]];
                            },
                        }
                    },
                    {
                        title: '无效区域颜色',
                        type: 'colorPicker',
                        value: {
                            get({ data }: EditorResult<Data>) {
                                return data.color[1];
                            },
                            set({ data }: EditorResult<Data>, value: string) {
                                data.color = [data.color[0], value];
                            },
                        }
                    },
                    {
                        type: 'inputNumber',
                        options: [
                            { min: 0, max: 1, step: 0.05, title: '外环半径' },
                            { min: 0, max: 1, step: 0.05, title: '内环半径' },
                        ],
                        value: {
                            get({ data }: EditorResult<Data>) {
                                return [data.radius, data.innerRadius];
                            },
                            set({ data }: EditorResult<Data>, value: number[]) {
                                [data.radius, data.innerRadius] = value;
                            },
                        }
                    },
                ]
            },
            {
                title: '内容配置',
                items: [
                    {
                        title: '标题文案',
                        type: 'text',
                        value: {
                            get({ data }: EditorResult<Data>) {
                                return data.statistic.title.content;
                            },
                            set({ data }: EditorResult<Data>, value: string) {
                                data.statistic = {
                                    ...data.statistic,
                                    title: {
                                        ...data.statistic.title,
                                        content: value
                                    }
                                };
                            },
                        }
                    },
                    {
                        title: '百分比内容',
                        type: 'switch',
                        value: {
                            get({ data }: EditorResult<Data>) {
                                return data.statistic.content;
                            },
                            set({ data }: EditorResult<Data>, value: boolean) {
                                data.statistic = {
                                    ...data.statistic,
                                    content: value
                                };
                            },
                        }
                    },
                ]
            },
        ];
    },
};
